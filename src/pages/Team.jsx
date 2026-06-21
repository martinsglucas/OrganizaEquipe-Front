import styles from "./Team.module.css";
import {
  getDiscoverableTeams,
  getMyTeamJoinRequests,
  getTeams,
  getTeam,
  requestTeamJoin,
} from "../api/services/teamService";
import { useEffect, useState, useCallback } from "react";
import TeamDetail from "../components/TeamDetail";
import { useTeam } from "../context/TeamContext";
import ModalCreateTeam from "../components/modals/ModalCreateTeam";
import { useOrganization } from "../context/OrganizationContext";
import Loading from "../components/Loading";
import LinkButton from "../components/LinkButton";
import { toast } from "react-toastify";

const requestStatusLabels = {
  pending: "Pendente",
  approved: "Aprovada",
  rejected: "Rejeitada",
};

function Team() {
  const { team, setTeam, teams, setTeams } = useTeam();
  const { organization } = useOrganization();
  const [showModal, setShowModal] = useState(false);
  const [isTeamLoading, setIsTeamLoading] = useState(false);
  const [discoverableTeams, setDiscoverableTeams] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);

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

  const fetchTeam = async () => {
    try {
      const teamFetched = await getTeam(team.id);
      setTeam(teamFetched);
    } catch (error) {
      console.error("Erro ao buscar equipe:", error);
    }
  };

  const fetchJoinOptions = async () => {
    try {
      const [availableTeams, requests] = await Promise.all([
        getDiscoverableTeams(),
        getMyTeamJoinRequests(),
      ]);
      setDiscoverableTeams(availableTeams);
      setJoinRequests(requests);
    } catch (error) {
      console.error("Erro ao buscar opções de ingresso:", error);
    }
  };

  useEffect(() => {
    if (!team){
      fetchTeams();
      fetchJoinOptions();
    } else {
      fetchTeam();
    }
  }, []);


  const handleChangeTeam = async (id) => {
    const team = await getTeam(id);
    setTeam(team);
  };

  const handleJoinRequested = (joinRequest) => {
    setJoinRequests((requests) => [joinRequest, ...requests]);
    setDiscoverableTeams((availableTeams) =>
      availableTeams.filter((availableTeam) => availableTeam.id !== joinRequest.team.id)
    );
  };

  const handleRequestJoin = async (teamId) => {
    try {
      const joinRequest = await requestTeamJoin(teamId);
      handleJoinRequested(joinRequest);
      toast.success("Solicitação enviada com sucesso!");
    } catch (error) {
      const message = error.response?.data?.detail;
      toast.error(message || "Erro ao enviar solicitação!");
    }
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

  if (!team) {
    return (
      <div className={styles.container}>
        <h2 className={styles.warning}>Nenhuma equipe selecionada</h2>
        {isTeamLoading ? (
          <Loading />
        ) : (
          <div className={styles.teams}>
            {teams.map((team) => (
              <button
                key={team.id}
                className={styles.team}
                onClick={() => handleChangeTeam(team.id)}
              >
                <h3>{team.name}</h3>
              </button>
            ))}
            <button className={styles.add} onClick={() => setShowModal(true)}>
              <span>+</span>
            </button>
          </div>
        )}
        {discoverableTeams.length > 0 && (
          <section className={styles.joinSection}>
            <h2>Equipes disponíveis na sua organização</h2>
            <div className={styles.joinList}>
              {discoverableTeams.map((availableTeam) => (
                <div key={availableTeam.id} className={styles.joinItem}>
                  <span>{availableTeam.name}</span>
                  <button onClick={() => handleRequestJoin(availableTeam.id)}>
                    Solicitar ingresso
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
        {joinRequests.length > 0 && (
          <section className={styles.joinSection}>
            <h2>Minhas solicitações</h2>
            <div className={styles.joinList}>
              {joinRequests.map((request) => (
                <div key={request.id} className={styles.joinItem}>
                  <span>{request.team.name}</span>
                  <strong className={styles[request.status]}>
                    {requestStatusLabels[request.status] || request.status}
                  </strong>
                </div>
              ))}
            </div>
          </section>
        )}
        {showModal && (
          <ModalCreateTeam
            closeModal={() => setShowModal(false)}
            onClose={() => setShowModal(false)}
            onJoinRequested={handleJoinRequested}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.teams}></div>
      <TeamDetail/>
    </div>
  );
}

export default Team;
