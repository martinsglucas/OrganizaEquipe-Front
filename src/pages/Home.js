import styles from "./Home.module.css";
import { useEffect, useState } from "react";
import { getTeams, getTeam, createTeam } from "../api/services/teamService";
import TeamCard from "../components/TeamCard";
import { useNavigate } from "react-router-dom";
import { useTeam } from "../context/TeamContext";
import ModalCreateTeam from "../components/modals/ModalCreateTeam";

function Home() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { setTeam, teams, setTeams } = useTeam();

  const getEquipes = async () => {
    try {
      const equipes = await getTeams(true);
      setTeams(equipes);
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
    }
  };

  useEffect(() => {
    getEquipes();
  }, []);

  const handleEquipeClick = async (id) => {
    const equipe = await getTeam(id);
    setTeam(equipe);
    navigate("/equipe");
  };

  const addEquipe = async (name, organization) => {
    const equipe = await createTeam({ name, organization });
    setTeams([...teams, equipe]);
    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container_equipes}>
        <h2>Minhas Equipes</h2>

        <div className={styles.equipes}>
          {teams.map((equipe) => (
            <TeamCard
              key={equipe.id}
              equipe={equipe}
              handleOnClick={() => {
                handleEquipeClick(equipe.id);
              }}
            />
          ))}
          <button className={styles.add} onClick={() => setShowModal(true)}>
            <span>+</span>
          </button>
        </div>
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

export default Home;
