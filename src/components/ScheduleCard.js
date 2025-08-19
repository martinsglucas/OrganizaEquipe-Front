import { useState } from "react";
import styles from "./ScheduleCard.module.css";
import { MdNotificationImportant, MdThumbUp } from "react-icons/md";
import ModalViewSchedule from "./modals/ModalViewSchedule";

function ScheduleCard({ schedule, onDelete }) {

  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    const date = new Date(year, month-1, day);
    const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
    return (
      <>
        <span className={styles.date}>{day}</span>
        <span className={styles.date}>
          {months[parseInt(month, 10) - 1].toUpperCase()}
        </span>
        <span className={styles.weekday}>
          {date
            .toLocaleDateString("pt-BR", { weekday: "short" })
            .substring(0, 3)
            .toUpperCase()}
        </span>
      </>
    );
  }

  const handleConfirmations = (schedule) => {
    const confirmedCount = schedule.participations.filter((p) => p.confirmation === true).length;
    const totalCount = schedule.participations.length;
    if (confirmedCount === totalCount) {
      return <>
        <MdThumbUp className={styles.iconConfirmed} />
        <span>{confirmedCount}/{totalCount}</span>
      </>
    } else {
      return <>
        <MdNotificationImportant className={styles.iconUnconfirmed} />
        <span>{confirmedCount}/{totalCount}</span>
      </>
    }

  }

  return (
    <>
      <button
        type="button"
        className={styles.card}
        onClick={() => {
          setShowModal(true);
        }}
      >
        <div className={styles.dateContainer}>
          {formatDate(schedule.date)}
          <span className={styles.weekday}>{schedule.hour.slice(0, 5)}</span>
        </div>
        <div className={styles.info}>
          <span className={styles.name}>{schedule.name}</span>
          <span>{schedule.team.name}</span>
          <span className={styles.confirmations}>
            {handleConfirmations(schedule)}
          </span>
        </div>
      </button>
      {showModal && (
        <ModalViewSchedule
          title={schedule.name}
          schedule={schedule}
          onClose={() => setShowModal(false)}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

export default ScheduleCard;
