import styles from "./ModalChangeTeam.module.css";
import Modal from "./Modal";
import ModalCreateTeam from "./ModalCreateTeam";
import { useEffect, useState } from "react";
import {
  getDiscoverableTeams,
  getMyTeamJoinRequests,
  getTeams,
  requestTeamJoin,
} from "../../api/services/teamService";
import { useTeam } from "../../context/TeamContext";
import { toast } from "react-toastify";
import Loading from "../Loading";

const requestStatusLabels = {
  pending: "Pendente",
  approved: "Aprovada",
  rejected: "Rejeitada",
};

function ModalChangeTeam({ closeModal, handleChangeTeam }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [discoverableTeams, setDiscoverableTeams] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { teams, setTeams } = useTeam();

  useEffect(() => {
    const loadTeamHub = async () => {
      try {
        const [memberTeams, availableTeams, requests] = await Promise.all([
          getTeams(true),
          getDiscoverableTeams(),
          getMyTeamJoinRequests(),
        ]);
        setTeams(memberTeams);
        setDiscoverableTeams(availableTeams);
        setJoinRequests(requests);
      } catch (error) {
        toast.error("Erro ao carregar equipes e solicitações!");
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamHub();
  }, [setTeams]);

  const handleJoinRequested = (joinRequest) => {
    setJoinRequests((requests) => [joinRequest, ...requests]);
    setDiscoverableTeams((availableTeams) =>
      availableTeams.filter((team) => team.id !== joinRequest.team.id)
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

  return (
    <Modal isOpen={true} onClose={closeModal} title={"Equipes"}>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.hub}>
          <section className={styles.section}>
            <h2>Minhas equipes</h2>
            {teams.length > 0 ? (
              <div className={styles.teams}>
                {teams.map((team) => (
                  <button
                    key={team.id}
                    className={styles.team}
                    onClick={() => handleChangeTeam(team)}
                  >
                    {team.name}
                  </button>
                ))}
              </div>
            ) : (
              <p>Você ainda não participa de uma equipe.</p>
            )}
          </section>

          <section className={styles.section}>
            <h2>Descobrir equipes</h2>
            {discoverableTeams.length > 0 ? (
              <div className={styles.list}>
                {discoverableTeams.map((team) => (
                  <div key={team.id} className={styles.listItem}>
                    <span>{team.name}</span>
                    <button onClick={() => handleRequestJoin(team.id)}>
                      Solicitar ingresso
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Nenhuma nova equipe disponível.</p>
            )}
          </section>

          <section className={styles.section}>
            <h2>Minhas solicitações</h2>
            {joinRequests.length > 0 ? (
              <div className={styles.list}>
                {joinRequests.map((request) => (
                  <div key={request.id} className={styles.listItem}>
                    <span>{request.team.name}</span>
                    <strong className={styles[request.status]}>
                      {requestStatusLabels[request.status] || request.status}
                    </strong>
                  </div>
                ))}
              </div>
            ) : (
              <p>Você ainda não enviou solicitações.</p>
            )}
          </section>

          <button
            className={styles.add}
            onClick={() => setShowCreateModal(true)}
          >
            Criar equipe ou ingressar por código
          </button>
        </div>
      )}
      {showCreateModal && (
        <ModalCreateTeam
          closeModal={() => setShowCreateModal(false)}
          onClose={() => setShowCreateModal(false)}
          onJoinRequested={handleJoinRequested}
          noMarginTop={true}
        />
      )}
    </Modal>
  );
}

export default ModalChangeTeam;
