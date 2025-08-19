import styles from "./Schedule.module.css";
import { getSchedules } from "../api/services/scheduleService";
import { useState, useEffect } from "react";
import ScheduleCard from "../components/ScheduleCard";
import { AiOutlinePlus } from "react-icons/ai";
import { useTeam } from "../context/TeamContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ModalCreateSchedule from "../components/modals/ModalCreateSchedule";

function Schedule() {

  const { user } = useAuth();
  const {teams } = useTeam();
  const [schedules, setSchedules] = useState([]);
  const [pastSchedules, setPastSchedules] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isAdminSomeTeam = teams.map((team) => team.admins).some((admins) => admins.includes(user.id));
  
  const searchSchedules = async () => {
    setIsLoading(true);
    try {
      const schedules = await getSchedules(true, pastSchedules ? "past" : "next");
      setSchedules(schedules);
    } catch (error) {
      console.error("Erro ao buscar escalas:", error);
      toast.error("Erro ao buscar escalas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    searchSchedules();
  }, [pastSchedules]);

  const onDelete = (schedule) => {
    const remainingSchedules = schedules.filter((s) => s.id !== schedule.id);
    setSchedules(remainingSchedules);
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.change}
        onClick={() => setPastSchedules(!pastSchedules)}
      >
        <div
          className={`${
            pastSchedules ? styles.pastSelected : styles.pastNotSelected
          }`}
        >
          Anteriores
        </div>
        <div
          className={`${
            !pastSchedules ? styles.nextSelected : styles.nextNotSelected
          }`}
        >
          Próximas
        </div>
      </div>
      {isAdminSomeTeam && (
        <AiOutlinePlus
          className={styles.add}
          onClick={() => {
            setShowModal(true);
          }}
        />
      )}
      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        schedules.map((schedule) => (
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
            onDelete={(sched) => onDelete(sched)}
          />
        ))
      )}
      {showModal && (
        <ModalCreateSchedule
          title="Criar Escala"
          onClose={() => setShowModal(false)}
          onCreate={(schedule) =>
            setSchedules(
              [...schedules, schedule].sort((s1, s2) => {
                const dateA = new Date(`${s1.date}T${s1.hour}`);
                const dateB = new Date(`${s2.date}T${s2.hour}`);
                return dateA - dateB;
              })
            )
          }
        />
      )}
    </div>
  );
}

export default Schedule;
