import styles from "./Team.module.css";
import { getTeams, getTeam } from "../api/services/teamService";
import { useEffect, useState, useCallback } from "react";
import TeamDetail from "../components/TeamDetail";
import { useTeam } from "../context/TeamContext";
import ModalCreateTeam from "../components/modals/ModalCreateTeam";
import { useOrganization } from "../context/OrganizationContext";
import Loading from "../components/Loading";

function Team() {
  const { team, setTeam, teams, setTeams } = useTeam();
  const { organization } = useOrganization();
  const [showModal, setShowModal] = useState(false);
  const [isTeamLoading, setIsTeamLoading] = useState(false);

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

  useEffect(() => {
    if (!team){
      fetchTeams();
    } else {
      fetchTeam();
    }
  }, []);


  const handleSwapTeam = async (id) => {
    const team = await getTeam(id);
    setTeam(team);
  };

  if (!organization) {
    return (
      <div className={`${styles.container} ${styles.center}`}>
        <h2 className={styles.warning}>Você ainda não faz parte de uma organização. <br></br> Crie ou ingresse em uma</h2>
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
                onClick={() => handleSwapTeam(team.id)}
              >
                <h3>{team.name}</h3>
              </button>
            ))}
            <button className={styles.add} onClick={() => setShowModal(true)}>
              <span>+</span>
            </button>
          </div>
        )}
        {showModal && (
          <ModalCreateTeam
            closeModal={() => setShowModal(false)}
            onClose={() => setShowModal(false)}
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
