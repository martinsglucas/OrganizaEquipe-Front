import styles from "./Team.module.css";
import { getTeams, getTeam } from "../api/services/teamService";
import { useEffect, useState, useCallback } from "react";
import TeamDetail from "../components/TeamDetail";
import { useTeam } from "../context/TeamContext";
import ModalCreateTeam from "../components/modals/ModalCreateTeam";
import { createTeam } from "../api/services/teamService";
import { useOrganization } from "../context/OrganizationContext";

function Team() {
  const { equipe, setEquipe, teams, setTeams } = useTeam();
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
      const team = await getTeam(equipe.id);
      setEquipe(team);
    } catch (error) {
      console.error("Erro ao buscar equipe:", error);
    }
  };

  useEffect(() => {
    if (!equipe){
      getEquipes();
    } else {
      getEquipe();
    }
  }, []);


  const handleSwapTeam = async (id) => {
    const equipe = await getTeam(id);
    setEquipe(equipe);
  };

  const addEquipe = async (name, organization) => {
    const equipe = await createTeam({ name, organization });
    setTeams([...teams, equipe]);
    setShowModal(false);
  };

  if (!organization) {
    return (
      <div className={`${styles.container} ${styles.center}`}>
        <h2 className={styles.aviso}>Você ainda não faz parte de uma organização. <br></br> Crie ou ingresse em uma</h2>
      </div>
    );
  }

  if (!equipe) {
    return (
      <div className={styles.container}>
        <h2 className={styles.aviso}>Nenhuma equipe selecionada</h2>
        <div className={styles.equipes}>
          {teams.map((equipe) => (
            <button
              key={equipe.id}
              className={styles.equipe}
              onClick={() => handleSwapTeam(equipe.id)}
            >
              <h3>{equipe.name}</h3>
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
      <div className={styles.equipes}></div>
      <TeamDetail/>
    </div>
  );
}

export default Team;
