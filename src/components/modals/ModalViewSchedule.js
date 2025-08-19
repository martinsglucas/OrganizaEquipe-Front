import styles from "./ModalViewSchedule.module.css";
import Modal from "./Modal";
import {
  MdThumbUp,
  MdWatchLater,
  MdNotificationImportant,
  MdCalendarMonth
} from "react-icons/md";
import { RiUserSharedFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { confirmScheduleParticipation, deleteSchedule } from "../../api/services/scheduleService";
import { toast } from "react-toastify";
import ModalCreateSchedule from "./ModalCreateSchedule";

function ModalViewSchedule({ title, schedule, onClose, onDelete }) {
  const [year, month, day] = schedule.date.split("-");
  const date = new Date(year, month - 1, day);
  const [viewMembers, setViewMembers] = useState(false);
  const { user } = useAuth();
  const [unconfirmed, setUnconfirmed] = useState(schedule.participations.some((p) => p.user.id === user.id && p.confirmation === false))
  const userParticipates = schedule.participations.some((p) => p.user.id === user.id)
  const [showEditModal, setShowEditModal] = useState(false);
  const userIsAdmin = schedule.team.admins.some(
    (admin) => admin.id === user.id
  );

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const confirmParticipation = async (confirmation) => {
    try {
      const participation = schedule.participations.find((p) => p.user.id === user.id);
      if (participation) {
        participation.confirmation = confirmation;
        await confirmScheduleParticipation(participation.id, {
          roles: participation.roles.map((role) => role.id),
          confirmation: confirmation,
        });
        setUnconfirmed(!confirmation);
        if (confirmation) {
          toast.success("Participação confirmada com sucesso!");
        } else {
          toast.success("Participação cancelada com sucesso!");
        }
      }
    } catch (error) {
      // console.error("Erro ao confirmar participação:", error);
      if (confirmation) {
        toast.error("Erro ao confirmar participação");
      } else {
        toast.error("Erro ao cancelar participação");
      }
    }
  }

  const removeSchedule = async () => {
    try {
      await deleteSchedule(schedule.id);
      toast.success("Escala excluída com sucesso!");
      onDelete(schedule)
      onClose()
    } catch (error) {
      toast.error("Erro ao excluir escala!");
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={title} noMarginTop={false}>
      <div className={styles.scheduleDetails}>
        <div
          className={styles.change}
          onClick={() => setViewMembers(!viewMembers)}
        >
          <div
            className={`${
              !viewMembers ? styles.infoSelected : styles.infoNotSelected
            }`}
          >
            Informações
          </div>
          <div
            className={`${
              viewMembers ? styles.membersSelected : styles.membersNotSelected
            }`}
          >
            Participantes
          </div>
        </div>
        {!viewMembers && (
          <div className={styles.info}>
            <div className={styles.item}>
              <MdCalendarMonth className={styles.icon} />
              <span>
                {/* {schedule.hour.slice(0, 5)} |{" "} */}
                {capitalize(
                  date.toLocaleDateString("pt-BR", { weekday: "long" })
                )}{" "}
                |{" "}
                {date.toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className={styles.item}>
              <MdWatchLater className={styles.icon} />
              <span>{schedule.hour.slice(0, 5)}</span>
            </div>
            <div className={styles.item}>
              <RiTeamFill className={styles.icon} />
              <span>Equipe: {schedule.team.name}</span>
            </div>
            <div className={styles.item}>
              <MdThumbUp className={styles.icon} />
              <span>
                Confirmações:{" "}
                {schedule.participations.filter((p) => p.confirmation).length}/
                {schedule.participations.length}
              </span>
            </div>
            {unconfirmed && (
              <p className={styles.alert}>Confirmação pendente</p>
            )}
            {userParticipates && (
              <div
                className={styles.confirm}
                onClick={() => {
                  confirmParticipation(unconfirmed);
                }}
              >
                <MdNotificationImportant className={styles.iconConfirm} />
                <span>{unconfirmed ? "Confirmar" : "Cancelar"}</span>
              </div>
            )}
          </div>
        )}
        {viewMembers &&
          schedule.participations.map((participation) => (
            <div key={participation.id} className={styles.participation}>
              <FaUserCircle className={styles.iconUser} />
              <div className={styles.participationDetails}>
                <p>{participation.user.first_name}</p>
                <span>{participation.roles.map((p) => p.name).join(", ")}</span>
                {participation.confirmation && (
                  <div className={styles.confirmed}>
                    <MdThumbUp className={styles.icon} />
                    <span>Confirmado</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        {userIsAdmin && (
          <div className={styles.edit}>
            <button className={styles.button_delete} onClick={() => {removeSchedule()}}>
              Apagar
            </button>
            <button
              className={styles.button_edit}
              onClick={() => setShowEditModal(true)}
            >
              Editar
            </button>
          </div>
        )}
      </div>
      {showEditModal && (
        <ModalCreateSchedule
          title={"Editar"}
          onClose={() => setShowEditModal(false)}
          onCreate={() => {}}
          schedule={schedule}
          noMarginTop={true}
        />
      )}
    </Modal>
  );
}

export default ModalViewSchedule;
