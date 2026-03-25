import styles from "./Home.module.css";
import { useEffect, useState } from "react";
import { getTeams, getTeam, createTeam } from "../api/services/teamService";
import TeamCard from "../components/TeamCard";
import { useNavigate } from "react-router-dom";
import { useTeam } from "../context/TeamContext";
import ModalCreateTeam from "../components/modals/ModalCreateTeam";
import { useOrganization } from "../context/OrganizationContext";
import Loading from "../components/Loading";
import LinkButton from "../components/LinkButton";
import NotificationCard from "../components/notifications/NotificationCard";
import IosInstallHint from "../components/notifications/IosInstallHint";
import { useNotifications } from "../context/NotificationContext";

function Home() {
  const [createTeamModal, setCreateTeamModal] = useState(false);
  const navigate = useNavigate();
  const { setTeam, teams, setTeams } = useTeam();
  const { organization } = useOrganization();
  const [isTeamLoading, setIsTeamLoading] = useState(false);
  const {
    status,
    isLoading: notificationsLoading,
    enableNotifications,
    refreshNotificationStatus,
    error: notificationsError,
  } = useNotifications();

  const fetchTeams = async () => {
    try {
      setIsTeamLoading(true);
      const teams = await getTeams(true);
      setTeams(teams);
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
    } finally {
      setIsTeamLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleTeamClick = async (id) => {
    const teams = await getTeam(id);
    setTeam(teams);
    navigate("/equipe");
  };

  const addTeam = async (name, organization) => {
    const team = await createTeam({ name, organization });
    setTeams([...teams, team]);
    setCreateTeamModal(false);
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
        <h2>Minhas Equipes</h2>

        {isTeamLoading ? (
          <Loading />
        ) : (
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
            <button className={styles.add} onClick={() => setCreateTeamModal(true)}>
              <span>+</span>
            </button>
          </div>
        )}
      </div>
      {createTeamModal && (
        <ModalCreateTeam
          closeModal={() => setCreateTeamModal(false)}
          handleCreateTeam={addTeam}
        />
      )}
    </div>
  );
}

export default Home;
