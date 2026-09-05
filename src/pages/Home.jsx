import styles from "./Home.module.css";
import { useCallback, useEffect, useState } from "react";
import { getTeams, getTeam } from "../api/services/teamService";
import TeamCard from "../components/TeamCard";
import { useNavigate } from "react-router-dom";
import { useTeam } from "../context/TeamContext";
import ModalChangeTeam from "../components/modals/ModalChangeTeam";
import { useOrganization } from "../context/OrganizationContext";
import Loading from "../components/Loading";
import LinkButton from "../components/LinkButton";
import NotificationCard from "../components/notifications/NotificationCard";
import IosInstallHint from "../components/notifications/IosInstallHint";
import { useNotifications } from "../context/NotificationContext";
import { IoSettingsOutline } from "react-icons/io5";
import dayjs from "dayjs";
import { getSchedules } from "../api/services/scheduleService";
import { getUnavailabilities } from "../api/services/unavailabilityService";
import ScheduleCard from "../components/ScheduleCard";

const HOME_PREVIEW_LIMIT = 3;

const selectUpcomingUnavailabilities = (unavailabilities) => {
  const today = dayjs().startOf("day");

  return unavailabilities
    .filter((unavailability) => {
      const lastDate = dayjs(
        unavailability.end_date || unavailability.start_date
      );
      return lastDate.isValid() && !lastDate.endOf("day").isBefore(today);
    })
    .sort((first, second) => {
      const dateDifference = dayjs(first.start_date).diff(
        dayjs(second.start_date)
      );
      return dateDifference || first.id - second.id;
    })
    .slice(0, HOME_PREVIEW_LIMIT);
};

const getUnavailabilityDateContent = ({ start_date, end_date }) => {
  const startDate = dayjs(start_date);
  const date = startDate.toDate();
  const hasDateRange = end_date && !dayjs(end_date).isSame(startDate, "day");

  return {
    day: startDate.format("DD"),
    month: date
      .toLocaleDateString("pt-BR", { month: "short" })
      .replace(".", "")
      .toUpperCase(),
    weekday: date
      .toLocaleDateString("pt-BR", { weekday: "short" })
      .replace(".", "")
      .toUpperCase(),
    detail: hasDateRange
      ? `Até ${dayjs(end_date).format("DD/MM/YYYY")}`
      : "Indisponível neste dia",
  };
};

function Home() {
  const [manageTeamModal, setManageTeamModal] = useState(false);
  const navigate = useNavigate();
  const { setTeam, teams, setTeams } = useTeam();
  const { organization } = useOrganization();
  const [isTeamLoading, setIsTeamLoading] = useState(false);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [upcomingUnavailabilities, setUpcomingUnavailabilities] = useState([]);
  const [areSchedulesLoading, setAreSchedulesLoading] = useState(false);
  const [areUnavailabilitiesLoading, setAreUnavailabilitiesLoading] =
    useState(false);
  const [schedulesError, setSchedulesError] = useState(false);
  const [unavailabilitiesError, setUnavailabilitiesError] = useState(false);
  const {
    status,
    isLoading: notificationsLoading,
    enableNotifications,
    refreshNotificationStatus,
    error: notificationsError,
  } = useNotifications();

  const fetchTeams = useCallback(async () => {
    try {
      setIsTeamLoading(true);
      const teams = await getTeams(true);
      setTeams(teams);
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
    } finally {
      setIsTeamLoading(false);
    }
  }, [setTeams]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    if (!organization) {
      setUpcomingSchedules([]);
      setUpcomingUnavailabilities([]);
      return undefined;
    }

    let isActive = true;

    const fetchUpcomingSchedules = async () => {
      setAreSchedulesLoading(true);
      setSchedulesError(false);

      try {
        const response = await getSchedules(
          "mine",
          "next",
          1,
          HOME_PREVIEW_LIMIT
        );
        if (isActive) {
          setUpcomingSchedules(response.results);
        }
      } catch (error) {
        console.error("Erro ao buscar próximas escalas:", error);
        if (isActive) {
          setSchedulesError(true);
          setUpcomingSchedules([]);
        }
      } finally {
        if (isActive) {
          setAreSchedulesLoading(false);
        }
      }
    };

    const fetchUpcomingUnavailabilities = async () => {
      setAreUnavailabilitiesLoading(true);
      setUnavailabilitiesError(false);

      try {
        const response = await getUnavailabilities(true);
        if (isActive) {
          setUpcomingUnavailabilities(
            selectUpcomingUnavailabilities(response)
          );
        }
      } catch (error) {
        console.error("Erro ao buscar próximas indisponibilidades:", error);
        if (isActive) {
          setUnavailabilitiesError(true);
          setUpcomingUnavailabilities([]);
        }
      } finally {
        if (isActive) {
          setAreUnavailabilitiesLoading(false);
        }
      }
    };

    fetchUpcomingSchedules();
    fetchUpcomingUnavailabilities();

    return () => {
      isActive = false;
    };
  }, [organization]);

  const handleTeamClick = async (id) => {
    const teams = await getTeam(id);
    setTeam(teams);
    navigate("/equipe");
  };

  const renderNotificationCard = () => {
    if (status === "unsupported" || status === "enabled" || status === "idle") {
      return null;
    }

    if (status === "install_required") {
      return (
        <NotificationCard
          title="Ative notificações no iPhone"
          description="No iPhone, as notificações funcionam somente no app adicionado à Tela de Início."
          tone="warning"
        >
          <IosInstallHint />
        </NotificationCard>
      );
    }

    if (status === "permission_denied") {
      return (
        <NotificationCard
          title="Notificações bloqueadas"
          description="Libere as notificações nas configurações do navegador e atualize o status quando terminar."
          actionLabel="Atualizar status"
          onAction={refreshNotificationStatus}
          disabled={notificationsLoading}
          tone="danger"
        />
      );
    }

    if (status === "error") {
      return (
        <NotificationCard
          title="Não foi possível ativar agora"
          description={notificationsError || "Tente novamente para sincronizar este dispositivo."}
          actionLabel="Tentar novamente"
          onAction={enableNotifications}
          disabled={notificationsLoading}
          tone="danger"
        />
      );
    }

    return (
      <NotificationCard
        title="Receba notificações de novas escalas"
        description="Ative para ser avisado quando novas escalas forem criadas para você."
        actionLabel={notificationsLoading ? "Ativando..." : "Ativar notificações"}
        onAction={enableNotifications}
        disabled={notificationsLoading}
      />
    );
  };

  if (!organization) {
    return (
      <div className={`${styles.container} ${styles.center}`}>
        <div className={styles.notificationBlock}>{renderNotificationCard()}</div>
        <h2 className={styles.warning}>
          É necessário fazer parte de uma organização.
        </h2>
        <LinkButton text={"Ir para organização"} to={"/organizacao"} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.notificationBlock}>{renderNotificationCard()}</div>

      <div className={styles.container_teams}>
        <div className={styles.teamsHeader}>
          <h2>Minhas Equipes</h2>
          {!isTeamLoading && teams.length > 0 && (
            <button
              className={styles.manageTeams}
              onClick={() => setManageTeamModal(true)}
              aria-label="Gerenciar equipes"
              title="Gerenciar equipes"
            >
              <IoSettingsOutline />
            </button>
          )}
        </div>

        {isTeamLoading ? (
          <Loading />
        ) : teams.length > 0 ? (
          <div className={styles.teams}>
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                handleOnClick={() => {
                  handleTeamClick(team.id);
                }}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyTeams}>
            <p>Você ainda não participa de uma equipe.</p>
            <button
              className={styles.findTeam}
              onClick={() => setManageTeamModal(true)}
            >
              Encontrar uma equipe
            </button>
          </div>
        )}
      </div>

      <section className={styles.overview} aria-labelledby="home-overview-title">
        <h2 id="home-overview-title">Em breve</h2>

        <div className={styles.overviewGrid}>
          <section
            className={styles.overviewPanel}
            aria-labelledby="upcoming-schedules-title"
          >
            <div className={styles.overviewPanelHeader}>
              <h3 id="upcoming-schedules-title">Próximas escalas</h3>
              <LinkButton text="Ver todas" to="/escala" />
            </div>

            {areSchedulesLoading ? (
              <Loading />
            ) : schedulesError ? (
              <p className={styles.overviewState} role="alert">
                Não foi possível carregar suas próximas escalas.
              </p>
            ) : upcomingSchedules.length > 0 ? (
              <div className={styles.previewList}>
                {upcomingSchedules.map((schedule) => (
                  <div className={styles.schedulePreviewCard} key={schedule.id}>
                    <ScheduleCard schedule={schedule} />
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.overviewState}>
                Você não está em nenhuma escala futura.
              </p>
            )}
          </section>

          <section
            className={styles.overviewPanel}
            aria-labelledby="upcoming-unavailabilities-title"
          >
            <div className={styles.overviewPanelHeader}>
              <h3 id="upcoming-unavailabilities-title">
                Próximas indisponibilidades
              </h3>
              <LinkButton text="Ver todas" to="/indisponibilidade" />
            </div>

            {areUnavailabilitiesLoading ? (
              <Loading />
            ) : unavailabilitiesError ? (
              <p className={styles.overviewState} role="alert">
                Não foi possível carregar suas indisponibilidades.
              </p>
            ) : upcomingUnavailabilities.length > 0 ? (
              <div className={styles.previewList}>
                {upcomingUnavailabilities.map((unavailability) => {
                  const dateContent =
                    getUnavailabilityDateContent(unavailability);

                  return (
                    <button
                      type="button"
                      className={styles.unavailabilityCard}
                      key={unavailability.id}
                      onClick={() => navigate("/indisponibilidade")}
                    >
                      <span className={styles.unavailabilityDate}>
                        <span className={styles.unavailabilityDay}>
                          {dateContent.day}
                        </span>
                        <span>{dateContent.month}</span>
                        <span>{dateContent.weekday}</span>
                      </span>
                      <span className={styles.unavailabilityInfo}>
                        <strong>{unavailability.description}</strong>
                        <span>{dateContent.detail}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className={styles.overviewState}>
                Você não possui indisponibilidades futuras.
              </p>
            )}
          </section>
        </div>
      </section>

      {manageTeamModal && (
        <ModalChangeTeam
          closeModal={() => setManageTeamModal(false)}
          handleChangeTeam={(selectedTeam) => {
            handleTeamClick(selectedTeam.id);
            setManageTeamModal(false);
          }}
        />
      )}
    </div>
  );
}

export default Home;
