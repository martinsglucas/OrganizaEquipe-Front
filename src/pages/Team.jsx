import styles from "./Team.module.css";
import { getTeam } from "../api/services/teamService";
import { useEffect, useState } from "react";
import TeamDetail from "../components/TeamDetail";
import { useTeam } from "../context/TeamContext";
import ModalChangeTeam from "../components/modals/ModalChangeTeam";
import { useOrganization } from "../context/OrganizationContext";
import LinkButton from "../components/LinkButton";

function Team() {
  const { team, setTeam } = useTeam();
  const { organization } = useOrganization();
  const [showModal, setShowModal] = useState(false);

  const fetchTeam = async () => {
    try {
      const teamFetched = await getTeam(team.id);
      setTeam(teamFetched);
    } catch (error) {
      console.error("Erro ao buscar equipe:", error);
    }
  };

  useEffect(() => {
    if (team) {
      fetchTeam();
    }
  }, []);


  const handleChangeTeam = async (id) => {
    const team = await getTeam(id);
    setTeam(team);
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
        <button className={styles.openHub} onClick={() => setShowModal(true)}>
          Escolher ou descobrir equipes
        </button>
        {showModal && (
          <ModalChangeTeam
            closeModal={() => setShowModal(false)}
            handleChangeTeam={(selectedTeam) => {
              handleChangeTeam(selectedTeam.id);
              setShowModal(false);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TeamDetail/>
    </div>
  );
}

export default Team;
