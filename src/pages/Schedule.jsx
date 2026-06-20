import styles from "./Schedule.module.css";
import { getSchedules } from "../api/services/scheduleService";
import { useState, useEffect, useCallback } from "react";
import ScheduleCard from "../components/ScheduleCard";
import { AiOutlinePlus } from "react-icons/ai";
import { useTeam } from "../context/TeamContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ModalCreateSchedule from "../components/modals/ModalCreateSchedule";
import { useOrganization } from "../context/OrganizationContext";
import Loading from "../components/Loading";
import LinkButton from "../components/LinkButton";

const PERIOD_OPTIONS = [
  { value: "next", label: "Próximas" },
  { value: "past", label: "Anteriores" },
];

const SCOPE_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "mine", label: "Escalado" },
];

const DEFAULT_SCHEDULE_FILTERS = {
  periodFilter: "next",
  scope: "mine",
};

const VALID_PERIOD_FILTERS = new Set(PERIOD_OPTIONS.map((option) => option.value));
const VALID_SCOPES = new Set(SCOPE_OPTIONS.map((option) => option.value));

const getScheduleFiltersStorageKey = (userId) =>
  `scheduleFilters:user:${userId}`;

const readStoredScheduleFilters = (userId) => {
  try {
    const storedFilters = localStorage.getItem(
      getScheduleFiltersStorageKey(userId)
    );

    if (!storedFilters) {
      return DEFAULT_SCHEDULE_FILTERS;
    }

    const parsedFilters = JSON.parse(storedFilters);
    const periodFilter = VALID_PERIOD_FILTERS.has(parsedFilters.periodFilter)
      ? parsedFilters.periodFilter
      : DEFAULT_SCHEDULE_FILTERS.periodFilter;
    const scope = VALID_SCOPES.has(parsedFilters.scope)
      ? parsedFilters.scope
      : DEFAULT_SCHEDULE_FILTERS.scope;

    return { periodFilter, scope };
  } catch {
    return DEFAULT_SCHEDULE_FILTERS;
  }
};

const saveScheduleFilters = (userId, filters) => {
  try {
    localStorage.setItem(
      getScheduleFiltersStorageKey(userId),
      JSON.stringify(filters)
    );
  } catch {
    // Storage can fail in private browsing or quota-limited contexts.
  }
};

function Schedule() {
  const { user } = useAuth();
  const { teams } = useTeam();
  const { organization } = useOrganization();

  const [schedules, setSchedules] = useState([]);
  const [periodFilter, setPeriodFilter] = useState(
    DEFAULT_SCHEDULE_FILTERS.periodFilter
  );
  const [scope, setScope] = useState(DEFAULT_SCHEDULE_FILTERS.scope);
  const [filtersReady, setFiltersReady] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);

  const [pageSize] = useState(10);
  const [nextPage, setNextPage] = useState(null);

  const userId = user?.id;

  const isAdminSomeTeam = teams
    .map((team) => team.admins)
    .some((admins) => admins.includes(userId));

  useEffect(() => {
    if (!userId) {
      setFiltersReady(false);
      return;
    }

    const storedFilters = readStoredScheduleFilters(userId);
    setPeriodFilter(storedFilters.periodFilter);
    setScope(storedFilters.scope);
    setNextPage(null);
    setFiltersReady(true);
  }, [userId]);

  useEffect(() => {
    if (!filtersReady || !userId) {
      return;
    }

    saveScheduleFilters(userId, { periodFilter, scope });
  }, [filtersReady, periodFilter, scope, userId]);

  const fetchSchedules = useCallback(
    async (pageToLoad = 1, append = false) => {
      if (append) {
        setIsLoadMoreLoading(true);
      } else {
        setIsLoading(true);
      }

      try {
        const response = await getSchedules(
          scope,
          periodFilter,
          pageToLoad,
          pageSize
        );
        const { results = [], nextPage: next = null } = response;

        setSchedules((currentSchedules) =>
          append ? [...currentSchedules, ...results] : results
        );
        setNextPage(next);
      } catch (error) {
        console.error("Erro ao buscar escalas:", error);
        toast.error("Erro ao buscar escalas");
      } finally {
        if (append) {
          setIsLoadMoreLoading(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [pageSize, periodFilter, scope]
  );

  useEffect(() => {
    if (!filtersReady) {
      return;
    }

    fetchSchedules(1);
  }, [fetchSchedules, filtersReady]);

  const refreshSchedules = async () => {
    await fetchSchedules(1);
  };

  const loadMore = async () => {
    if (!nextPage) return;
    await fetchSchedules(nextPage, true);
  };

  if (!organization) {
    return (
      <div className={`${styles.container} ${styles.center}`}>
        <h2 className={styles.warning}>
          É necessário fazer parte de uma organização.
        </h2>
        <LinkButton text={"Ir para organização"} to={"/organizacao"} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <span className={styles.filtersTitle}>Filtros</span>

        <div className={styles.filtersRow}>
          <label className={styles.filterField}>
            <span className={styles.srOnly}>Filtrar por período</span>
            <select
              value={periodFilter}
              onChange={(event) => setPeriodFilter(event.target.value)}
              aria-label="Filtrar por período"
            >
              {PERIOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.filterField}>
            <span className={styles.srOnly}>Filtrar por participação</span>
            <select
              value={scope}
              onChange={(event) => setScope(event.target.value)}
              aria-label="Filtrar por participação"
            >
              {SCOPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {isAdminSomeTeam && (
        <AiOutlinePlus
          className={styles.add}
          onClick={() => {
            setShowModal(true);
          }}
        />
      )}
      {isLoading ? (
        <div className={styles.loading}>
          <Loading />
        </div>
      ) : schedules.length > 0 ? (
        <>
          {schedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onDelete={refreshSchedules}
              onUpdate={refreshSchedules}
            />
          ))}

          <div className={styles.loadMoreContainer}>
            {nextPage && (
              <button
                className={styles.loadMoreButton}
                onClick={loadMore}
                disabled={!nextPage || isLoadMoreLoading}
                aria-disabled={!nextPage || isLoadMoreLoading}
              >
                {isLoadMoreLoading ? "Carregando..." : "Carregar mais"}
              </button>
            )}
          </div>
        </>
      ) : (
        <h3>Sem escalas</h3>
      )}
      {showModal && (
        <ModalCreateSchedule
          title="Criar Escala"
          onClose={() => setShowModal(false)}
          onCreate={refreshSchedules}
        />
      )}
    </div>
  );
}

export default Schedule;
