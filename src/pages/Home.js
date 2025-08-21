import styles from "./Home.module.css";
import { useEffect, useState } from "react";
import { getTeams, getTeam, createTeam } from "../api/services/teamService";
import TeamCard from "../components/TeamCard";
import { useNavigate } from "react-router-dom";
import { useTeam } from "../context/TeamContext";
import ModalCreateTeam from "../components/modals/ModalCreateTeam";
import { useOrganization } from "../context/OrganizationContext";
import Loading from "../components/Loading";

function Home() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { setTeam, teams, setTeams } = useTeam();
  const { organization } = useOrganization();
  const [isTeamLoading, setIsTeamLoading] = useState(false);

  const fetchTeams = async () => {
    try {
      setIsTeamLoading(true);
      const teams = await getTeams(true);
      setTeams(teams);
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
    } finally {
      setIsTeamLoading(false);
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

  if (!organization) {
    return (
      <div className={`${styles.container} ${styles.center}`}>
        <h2 className={styles.warning}>
          Você ainda não faz parte de uma organização. <br></br> Crie ou
          ingresse em uma
        </h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.container_teams}>
        <h2>Minhas Equipes</h2>

        {isTeamLoading ? (
          <Loading />
        ) : (
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
        )}
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
