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
  const [status, setStatus] = useState(team ? "loading" : "ready");

  const fetchTeam = async () => {
    try {
      setStatus("loading");
      const teamFetched = await getTeam(team.id);
      setTeam(teamFetched);
      setStatus("ready");
    } catch (error) {
      console.error("Erro ao buscar equipe:", error);
      setStatus("error");
    }
  };

  useEffect(() => {
    if (team) {
      fetchTeam();
    }
  }, [team?.id]);


  const handleChangeTeam = async (id) => {
    try {
      const selectedTeam = await getTeam(id);
      setTeam(selectedTeam);
      setStatus("ready");
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao selecionar equipe:", error);
      setStatus("error");
    }
  };

  if (!organization) {
    return (
      <main className={`${styles.container} ${styles.center}`}>
        <section className={styles.stateCard}>
          <p className={styles.eyebrow}>Equipes</p>
          <h1>Primeiro, entre em uma organização</h1>
          <p>As equipes disponíveis pertencem às organizações das quais você participa.</p>
          <LinkButton text={"Ir para organização"} to={"/organizacao"} />
        </section>
      </main>
    );
  }

  if (status === "loading") {
    return (
      <main className={`${styles.container} ${styles.center}`} aria-live="polite">
        <p className={styles.eyebrow}>Equipes</p>
        <h1>Carregando equipe...</h1>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className={`${styles.container} ${styles.center}`}>
        <section className={styles.stateCard} role="alert">
          <p className={styles.eyebrow}>Equipes</p>
          <h1>Não foi possível carregar a equipe</h1>
          <p>Tente novamente ou escolha outra equipe.</p>
          <div className={styles.actions}>
            {team && (
              <button className={styles.secondaryAction} onClick={fetchTeam}>
                Tentar novamente
              </button>
            )}
            <button className={styles.primaryAction} onClick={() => setShowModal(true)}>
              Escolher equipe
            </button>
          </div>
        </section>
        {showModal && (
          <ModalChangeTeam
            closeModal={() => setShowModal(false)}
            handleChangeTeam={(selectedTeam) => handleChangeTeam(selectedTeam.id)}
          />
        )}
      </main>
    );
  }

  if (!team) {
    return (
      <main className={`${styles.container} ${styles.center}`}>
        <section className={styles.stateCard}>
          <p className={styles.eyebrow}>Equipes</p>
          <h1>Nenhuma equipe selecionada</h1>
          <p>Escolha uma equipe da qual participa ou descubra equipes da sua organização.</p>
          <button className={styles.primaryAction} onClick={() => setShowModal(true)}>
            Escolher ou descobrir equipes
          </button>
        </section>
        {showModal && (
          <ModalChangeTeam
            closeModal={() => setShowModal(false)}
            handleChangeTeam={(selectedTeam) => {
              handleChangeTeam(selectedTeam.id);
            }}
          />
        )}
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <TeamDetail/>
    </main>
  );
}

export default Team;
