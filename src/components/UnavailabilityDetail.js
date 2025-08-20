import styles from "./UnavailabilityDetail.module.css";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { deleteUnavailability } from "../api/services/unavailabilityService";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { toast } from "react-toastify";
import { useState } from "react";
import ModalConfirmation from "./modals/ModalConfirmation";
dayjs.locale("pt-br");

function UnavailabilityDetail({
  day,
  unavailabilities,
  setUnavailabilities,
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [unavailabilityToRemove, setUnavailabilityToRemove] = useState(null);
  const filteredUnavailabilities = unavailabilities.filter(
    (unavailability) =>
      dayjs(unavailability.start_date).isSame(dayjs(day), "day")
  );

  const removeUnavailability = async () => {
    try {
      const newUnavailabilities = unavailabilities.filter(
        (unavailability) => unavailability.id !== unavailabilityToRemove.id
      );
      await deleteUnavailability(unavailabilityToRemove.id);
      setUnavailabilities(newUnavailabilities);
      setShowConfirmation(false);
      toast.success("Indisponibilidade deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar indisponibilidade:", error);
      toast.error("Erro ao deletar indisponibilidade");
    }
  };

  const confirm = (unavailability) => {
    setUnavailabilityToRemove(unavailability);
    setShowConfirmation(true);
  };

  return (
    <div className={styles.container}>
      <span className={styles.day}>
        {dayjs(day).format("dddd, D [de] MMMM")}
      </span>
      <div className={styles.unavailabilities}>
        {unavailabilities.length > 0 ? (
          filteredUnavailabilities.map((unavailability) => (
            <div className={styles.unavailability} key={unavailability.id}>
              <div className={styles.info}>
                <span className={styles.description}>
                  {unavailability.description}
                </span>
                <span>
                  {dayjs(unavailability.start_date).format("DD/MM/YYYY")}
                </span>
              </div>
              <FaTrash
                className={styles.delete}
                onClick={() => confirm(unavailability)}
              />
            </div>
          ))
        ) : (
          <div>lista vazia</div>
        )}
      </div>
      {showConfirmation && (
        <ModalConfirmation
          title={"Remover Indisponibilidade"}
          message={"Tem certeza que deseja remover essa indisponibilidade?"}
          onClose={() => setShowConfirmation(false)}
          onConfirm={removeUnavailability}
        />
      )}
    </div>
  );
}

export default UnavailabilityDetail;
