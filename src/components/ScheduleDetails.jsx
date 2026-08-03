import { useEffect, useState } from "react";
import {
  MdThumbUp,
  MdWatchLater,
  MdNotificationImportant,
  MdCalendarMonth,
} from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { toast } from "react-toastify";

import {
  confirmScheduleParticipation,
  deleteSchedule,
} from "../api/services/scheduleService";
import { useAuth } from "../context/AuthContext";
import ModalConfirmation from "./modals/ModalConfirmation";
import ModalCreateSchedule from "./modals/ModalCreateSchedule";
import styles from "./modals/ModalViewSchedule.module.css";

function ScheduleDetails({ schedule, onDelete, onUpdate, standalone = false }) {
  const [currentSchedule, setCurrentSchedule] = useState(schedule);
  const [viewMembers, setViewMembers] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setCurrentSchedule(schedule);
  }, [schedule]);

  const [year, month, day] = currentSchedule.date.split("-");
  const date = new Date(year, month - 1, day);
  const userParticipation = currentSchedule.participations.find(
    (participation) => participation.user.id === user.id
  );
  const unconfirmed = userParticipation?.confirmation === false;
  const userIsAdmin = currentSchedule.team.admins.some(
    (admin) => admin.id === user.id
  );

  const capitalize = (value) =>
    value.charAt(0).toUpperCase() + value.slice(1);

  const confirmParticipation = async (confirmation) => {
    if (!userParticipation) {
      return;
    }

    try {
      await confirmScheduleParticipation(userParticipation.id, {
        roles: userParticipation.roles.map((role) => role.id),
        confirmation,
      });
      setCurrentSchedule((previousSchedule) => ({
        ...previousSchedule,
        participations: previousSchedule.participations.map((participation) =>
          participation.id === userParticipation.id
            ? { ...participation, confirmation }
            : participation
        ),
      }));
      toast.success(
        confirmation
          ? "Participação confirmada com sucesso!"
          : "Participação cancelada com sucesso!"
      );
    } catch {
      toast.error(
        confirmation
          ? "Erro ao confirmar participação"
          : "Erro ao cancelar participação"
      );
    }
  };

  const removeSchedule = async () => {
    try {
      await deleteSchedule(currentSchedule.id);
      setShowConfirmation(false);
      toast.success("Escala excluída com sucesso!");
      if (onDelete) {
        await onDelete(currentSchedule);
      }
    } catch {
      toast.error("Erro ao excluir escala!");
    }
  };

  return (
    <div
      className={`${styles.scheduleDetails} ${
        standalone ? styles.standalone : ""
      }`}
    >
      <div className={styles.change} onClick={() => setViewMembers(!viewMembers)}>
        <div
          className={
            !viewMembers ? styles.infoSelected : styles.infoNotSelected
          }
        >
          Informações
        </div>
        <div
          className={
            viewMembers ? styles.membersSelected : styles.membersNotSelected
          }
        >
          Participantes
        </div>
      </div>
      {!viewMembers && (
        <div className={styles.info}>
          <div className={styles.item}>
            <MdCalendarMonth className={styles.icon} />
            <span>
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
            <span>{currentSchedule.hour.slice(0, 5)}</span>
          </div>
          <div className={styles.item}>
            <RiTeamFill className={styles.icon} />
            <span>Equipe: {currentSchedule.team.name}</span>
          </div>
          <div className={styles.item}>
            <MdThumbUp className={styles.icon} />
            <span>
              Confirmações:{" "}
              {
                currentSchedule.participations.filter(
                  (participation) => participation.confirmation
                ).length
              }
              /{currentSchedule.participations.length}
            </span>
          </div>
          {unconfirmed && <p className={styles.alert}>Confirmação pendente</p>}
          {userParticipation && (
            <div
              className={styles.confirm}
              onClick={() => confirmParticipation(unconfirmed)}
            >
              <MdNotificationImportant className={styles.iconConfirm} />
              <span>{unconfirmed ? "Confirmar" : "Cancelar"}</span>
            </div>
          )}
        </div>
      )}
      {viewMembers &&
        currentSchedule.participations.map((participation) => (
          <div key={participation.id} className={styles.participation}>
            <FaUserCircle className={styles.iconUser} />
            <div className={styles.participationDetails}>
              <p>{participation.user.first_name}</p>
              <span>{participation.roles.map((role) => role.name).join(", ")}</span>
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
          <button
            className={styles.button_delete}
            onClick={() => setShowConfirmation(true)}
          >
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
      {showEditModal && (
        <ModalCreateSchedule
          title="Editar"
          onClose={() => setShowEditModal(false)}
          schedule={currentSchedule}
          noMarginTop={true}
          onSuccess={async () => {
            setShowEditModal(false);
            if (onUpdate) {
              await onUpdate(currentSchedule);
            }
          }}
        />
      )}
      {showConfirmation && (
        <ModalConfirmation
          title="Apagar escala"
          message={`Tem certeza que deseja apagar a escala ${currentSchedule.name}`}
          onClose={() => setShowConfirmation(false)}
          onConfirm={removeSchedule}
        />
      )}
    </div>
  );
}

export default ScheduleDetails;
