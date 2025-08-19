import styles from "./Team.module.css";
import { getTeams, getTeam } from "../api/services/teamService";
import { useEffect, useState, useCallback } from "react";
import TeamDetail from "../components/TeamDetail";
import { useTeam } from "../context/TeamContext";
import ModalCreateTeam from "../components/modals/ModalCreateTeam";
import { createTeam } from "../api/services/teamService";
import { useOrganization } from "../context/OrganizationContext";

function Team() {
  const { team, setTeam, teams, setTeams } = useTeam();
  const { organization } = useOrganization();
  const [showModal, setShowModal] = useState(false);

  const getEquipes = useCallback(async () => {
    try {
      const equipes = await getTeams(true);
      setTeams(equipes);
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
    }
  }, [setTeams]);

  const getEquipe = async () => {
    try {
      const team = await getTeam(team.id);
      setTeam(team);
    } catch (error) {
      console.error("Erro ao buscar equipe:", error);
    }
  };

  useEffect(() => {
    if (!team){
      getEquipes();
    } else {
      getEquipe();
    }
  }, []);


  const handleSwapTeam = async (id) => {
    const team = await getTeam(id);
    setTeam(team);
  };

  const addEquipe = async (name, organization) => {
    const team = await createTeam({ name, organization });
    setTeams([...teams, team]);
    setShowModal(false);
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
        {showModal && (
          <ModalCreateTeam
            closeModal={() => setShowModal(false)}
            handleCreateTeam={addEquipe}
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
