import styles from "./IndisponibilidadeDetalhe.module.css";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { deleteUnavailability } from "../api/services/unavailabilityService";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { toast } from "react-toastify";
import { useState } from "react";
import ModalConfirmation from "./modals/ModalConfirmation";
dayjs.locale("pt-br");

function IndisponibilidadeDetalhe({
  dia,
  indisponibilidades,
  setIndisponibilidades,
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [unavailabilityToRemove, setUnavailabilityToRemove] = useState(null);
  const indisponibilidadesFiltradas = indisponibilidades.filter(
    (indisponibilidade) =>
      dayjs(indisponibilidade.data_inicio).isSame(dayjs(dia), "day")
  );

  const deleteIndisponibilidade = async () => {
    try {
      const newIndisponibilidades = indisponibilidades.filter(
        (ind) => ind.id !== unavailabilityToRemove.id
      );
      await deleteUnavailability(unavailabilityToRemove.id);
      setIndisponibilidades(newIndisponibilidades);
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
      <span className={styles.dia}>
        {dayjs(dia).format("dddd, D [de] MMMM")}
      </span>
      <div className={styles.indisponibilidades}>
        {indisponibilidades.length > 0 ? (
          indisponibilidadesFiltradas.map((indisponibilidade) => (
            <div
              className={styles.indisponibilidade}
              key={indisponibilidade.id}
            >
              <span className={styles.descricao}>
                {indisponibilidade.descricao}
              </span>
              <div className={styles.info}>
                <span>
                  Data Inicial:{" "}
                  {dayjs(indisponibilidade.data_inicio).format("DD/MM/YYYY")}
                </span>
                <span>
                  {indisponibilidade.data_fim
                    ? `Data Final: ${dayjs(indisponibilidade.data_fim).format(
                        "DD/MM/YYYY"
                      )}`
                    : ""}
                </span>
              </div>
              <div className={styles.buttons}>
                <FaPencilAlt className={styles.edit} onClick={() => {}} />
                <FaTrash
                  className={styles.delete}
                  onClick={() => confirm(indisponibilidade)}
                />
              </div>
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
          onConfirm={deleteIndisponibilidade}
        />
      )}
    </div>
  );
}

export default IndisponibilidadeDetalhe;
