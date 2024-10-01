import styles from "./Home.module.css";
import { useEffect, useState } from "react";
import { getTeams, getTeam, createTeam } from "../api/services/teamService";
import EquipeCard from "../components/EquipeCard";
import { useNavigate } from "react-router-dom";
import { useEquipe } from "../context/EquipeContext";
import ModalCreateTeam from "../components/ModalCreateTeam";

function Home() {
  const [equipes, setEquipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { setEquipe } = useEquipe();

  const getEquipes = async () => {
    try {
      const equipes = await getTeams(true);
      setEquipes(equipes);
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
    }
  };

  useEffect(() => {
    getEquipes();
  }, []);

  const handleEquipeClick = async (id) => {
    const equipe = await getTeam(id);
    setEquipe(equipe);
    navigate("/equipe");
  };

  const addEquipe = async (nome) => {
    const equipe = await createTeam({ nome });
    setEquipes([...equipes, equipe]);
    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container_equipes}>
        <h2>Minhas Equipes</h2>

        <div className={styles.equipes}>
          {equipes.map((equipe) => (
            <EquipeCard
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
