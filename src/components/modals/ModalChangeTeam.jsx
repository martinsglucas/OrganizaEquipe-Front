import styles from "./ModalChangeTeam.module.css";
import Modal from "./Modal";
import ModalCreateTeam from "./ModalCreateTeam";
import { useEffect, useState } from "react";
import { getTeamHub, requestTeamJoin } from "../../api/services/teamService";
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
  const [status, setStatus] = useState("loading");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [pendingTeamId, setPendingTeamId] = useState(null);
  const { teams, setTeams } = useTeam();

  useEffect(() => {
    const loadTeamHub = async () => {
      try {
        setStatus("loading");
        const {
          member_teams: memberTeams = [],
          discoverable_teams: availableTeams = [],
          join_requests: requests = [],
        } = await getTeamHub();
        setTeams(memberTeams);
        setDiscoverableTeams(availableTeams);
        setJoinRequests(requests);
        setStatus("ready");
      } catch (error) {
        setStatus("error");
      }
    };

    loadTeamHub();
  }, [setTeams, loadAttempt]);

  const handleJoinRequested = (joinRequest) => {
    setJoinRequests((requests) => [
      joinRequest,
      ...requests.filter((request) => request.id !== joinRequest.id),
    ]);
    setDiscoverableTeams((availableTeams) =>
      availableTeams.filter((team) => team.id !== joinRequest.team.id)
    );
  };

  const handleRequestJoin = async (teamId) => {
    try {
      setPendingTeamId(teamId);
      const joinRequest = await requestTeamJoin(teamId);
      handleJoinRequested(joinRequest);
      toast.success("Solicitação enviada com sucesso!");
    } catch (error) {
      const message = error.response?.data?.detail;
      toast.error(message || "Erro ao enviar solicitação!");
    } finally {
      setPendingTeamId(null);
    }
  };

  return (
    <Modal isOpen={true} onClose={closeModal} title={"Equipes"}>
      {status === "loading" ? (
        <div className={styles.state} aria-live="polite">
          <Loading />
          <p>Carregando equipes e solicitações...</p>
        </div>
      ) : status === "error" ? (
        <div className={styles.state} role="alert">
          <h2>Não foi possível carregar as equipes</h2>
          <p>Verifique sua conexão e tente novamente.</p>
          <button onClick={() => setLoadAttempt((attempt) => attempt + 1)}>
            Tentar novamente
          </button>
        </div>
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
                    <button
                      onClick={() => handleRequestJoin(team.id)}
                      disabled={pendingTeamId !== null}
                      aria-busy={pendingTeamId === team.id}
                    >
                      {pendingTeamId === team.id
                        ? "Enviando..."
                        : "Solicitar ingresso"}
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

          <div className={styles.createPath}>
            <h2>Outra forma de acesso</h2>
            <p>Use um código recebido ou crie uma equipe se tiver permissão.</p>
            <button
              className={styles.add}
              onClick={() => setShowCreateModal(true)}
            >
              Criar equipe ou ingressar por código
            </button>
          </div>
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
