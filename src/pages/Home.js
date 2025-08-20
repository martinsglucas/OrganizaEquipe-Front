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

  const fetchTeams = async () => {
    try {
      const teams = await getTeams(true);
      setTeams(teams);
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleTeamClick = async (id) => {
    const teams = await getTeam(id);
    setTeam(teams);
    navigate("/equipe");
  };

  const addTeam = async (name, organization) => {
    const team = await createTeam({ name, organization });
    setTeams([...teams, team]);
    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container_teams}>
        <h2>Minhas Equipes</h2>

        <div className={styles.teams}>
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              handleOnClick={() => {
                handleTeamClick(team.id);
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
          handleCreateTeam={addTeam}
        />
      )}
    </div>
  );
}

export default Home;
