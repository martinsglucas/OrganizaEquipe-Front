import styles from "./Equipe.module.css";
import { getTeams, getTeam } from "../api/services/teamService";
import { useEffect, useState } from "react";
import EquipeDetalhe from "../components/EquipeDetalhe";
import { useEquipe } from "../context/EquipeContext";
// import Select from "../components/form/Select";

function Equipe() {
  const [equipes, setEquipes] = useState([]);
  const { equipe, setEquipe } = useEquipe();

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

  // const handleEquipeChange = async (event) => {
  //   const selectedEquipe = await getTeam(event.target.value);
  //   setEquipe(selectedEquipe);
  // };

  const handleSwapTeam = async (id) => {
    const equipe = await getTeam(id);
    setEquipe(equipe);
  };

  if (!equipe) {
    return (
      <div className={styles.container}>
        <h2>Nenhuma equipe selecionada</h2>
        {/* <Select
          text={"Selecione uma equipe"}
          name={"select"}
          options={equipes}
          handleOnChange={handleEquipeChange}
        /> */}
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
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.equipes}></div>
      <EquipeDetalhe equipe={equipe} equipes={equipes} />
    </div>
  );
}

export default Equipe;
