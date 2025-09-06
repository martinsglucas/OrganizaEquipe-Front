import styles from "./ModalCreateUnavailability.module.css";
import { useState } from "react";
import DateInput from "../form/DateInput";
import { createUnavailability } from "../../api/services/unavailabilityService";
import Input from "../form/Input";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import Modal from "./Modal";
import ModalLoading from "./ModalLoading";
import { toast } from "react-toastify";
dayjs.locale("pt-br");

function ModalCreateUnavailability({
  onClose,
  day,
  unavailabilities,
  setUnavailabilities,
  refresh,
}) {
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(dayjs(day).format("YYYY-MM-DD"));
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (newValue) => {
    setDate(newValue);
  };

  const handleSubmit = async () => {
    try {
      if (!reason) {
        toast.warn("Insira o motivo da indisponibilidade.");
        return;
      }
      setIsLoading(true);
      const unavailability = await createUnavailability({ description: reason, start_date: date });
      setUnavailabilities([...unavailabilities, unavailability])
      onClose();
      toast.success("Indisponibilidade criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar indisponibilidade:", error);
      toast.error("Erro ao criar indisponibilidade");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={"Criar Indisponibilidade"}>
      <Input
        name={"reason"}
        // text={"Motivo"}
        type={"text"}
        value={reason}
        handleOnChange={(e) => setReason(e.target.value)}
        placeholder={"Digite o motivo"}
      />
      <DateInput value={date} onChange={handleDateChange} />
      <div className={styles.buttons}>
        <button className={styles.button_submit} onClick={handleSubmit}>
          Criar
        </button>
      </div>
      {isLoading && <ModalLoading isOpen={isLoading} />}
    </Modal>
  );
}

export default ModalCreateUnavailability;
