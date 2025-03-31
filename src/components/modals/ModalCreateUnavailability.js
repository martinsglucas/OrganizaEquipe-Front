import styles from "./ModalCreateUnavailability.module.css";
import { useState } from "react";
import DateInput from "../form/DateInput";
import { createUnavailability } from "../../api/services/unavailabilityService";
import Input from "../form/Input";
import Checkbox from "../form/Checkbox";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import Modal from "./Modal";
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
  const [end, setEnd] = useState(dayjs(day).add(1, "day").format("YYYY-MM-DD"));
  const [period, setPeriod] = useState(false);

  const handleDateChange = (newValue) => {
    setDate(newValue);
  };
  const handleEndChange = (newValue) => {
    setEnd(newValue);
  };

  const handleSubmit = async () => {
    try {
      const unavailability = await createUnavailability({ descricao: reason, data_inicio: date });
      setUnavailabilities([...unavailabilities, unavailability])
      onClose();
      toast.success("Indisponibilidade criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar indisponibilidade:", error);
      toast.error("Erro ao criar indisponibilidade");
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
      <Checkbox
        id={"period"}
        checked={period}
        text={"Selecionar periodo"}
        handleOnChange={() => {
          setEnd(dayjs(day).add(1, "day").format("YYYY-MM-DD"));
          setPeriod(!period);
        }}
      />
      <DateInput value={date} onChange={handleDateChange} />
      {period && (
        <DateInput
          name={"date"}
          placeholder={"Data Final"}
          value={end}
          onChange={handleEndChange}
        />
      )}
      <div className={styles.buttons}>
        {/* <button className={styles.button_cancel} onClick={onClose}>
            Cancelar
          </button> */}
        <button className={styles.button_submit} onClick={handleSubmit}>
          Criar
        </button>
      </div>
    </Modal>
  );
}

export default ModalCreateUnavailability;
