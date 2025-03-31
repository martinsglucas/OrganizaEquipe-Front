import styles from "./Equipe.module.css";
import { getTeams, getTeam } from "../api/services/teamService";
import { useEffect, useState } from "react";
import EquipeDetalhe from "../components/EquipeDetalhe";
import { useEquipe } from "../context/EquipeContext";
import ModalCreateTeam from "../components/modals/ModalCreateTeam";
import { createTeam } from "../api/services/teamService";

function Equipe() {
  const [equipes, setEquipes] = useState([]);
  const { equipe, setEquipe } = useEquipe();
  const [showModal, setShowModal] = useState(false);

  const getEquipes = async () => {
    try {
      const equipes = await getTeams(true);
      setEquipes(equipes);
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
    }
  };

  useEffect(() => {
    if (!equipe){
      getEquipes();
    }
  }, []);


  const handleSwapTeam = async (id) => {
    const equipe = await getTeam(id);
    setEquipe(equipe);
  };

  const addEquipe = async (nome) => {
    const equipe = await createTeam({ nome });
    setEquipes([...equipes, equipe]);
    setShowModal(false);
  };

  if (!equipe) {
    return (
      <div className={styles.container}>
        <h2>Nenhuma equipe selecionada</h2>
        <div className={styles.equipes}>
          {equipes.map((equipe) => (
            <button
              key={equipe.id}
              className={styles.equipe}
              onClick={() => handleSwapTeam(equipe.id)}
            >
              {equipe.nome}
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
      <EquipeDetalhe equipes={equipes} setEquipes={setEquipes}/>
    </div>
  );
}

export default Equipe;
