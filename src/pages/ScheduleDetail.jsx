import { useCallback, useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

import { getSchedule } from "../api/services/scheduleService";
import Loading from "../components/Loading";
import ScheduleDetails from "../components/ScheduleDetails";
import styles from "./ScheduleDetail.module.css";

function ScheduleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchSchedule = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      setSchedule(await getSchedule(id));
    } catch (error) {
      setSchedule(null);
      const status = error.response?.status;
      if (status === 404) {
        setErrorMessage("Escala não encontrada.");
      } else if (status === 403) {
        setErrorMessage("Você não tem permissão para acessar esta escala.");
      } else {
        setErrorMessage("Não foi possível carregar esta escala.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  if (isLoading) {
    return (
      <div className={styles.center}>
        <Loading />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className={styles.center} role="alert">
        <h2>{errorMessage}</h2>
        <button className={styles.backButton} onClick={() => navigate("/escala")}>
          Voltar para escalas
        </button>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <MdArrowBack aria-hidden="true" />
          <span>Voltar</span>
        </button>

        <section className={styles.card} aria-labelledby="schedule-title">
          <header className={styles.hero}>
            <span className={styles.eyebrow}>Escala</span>
            <h1 id="schedule-title">{schedule.name}</h1>
            <span className={styles.team}>{schedule.team.name}</span>
          </header>

          <ScheduleDetails
            schedule={schedule}
            standalone={true}
            onDelete={() => navigate("/escala", { replace: true })}
            onUpdate={fetchSchedule}
          />
        </section>
      </div>
    </main>
  );
}

export default ScheduleDetail;
