import styles from "./Indisponibilidade.module.css";
import { AiFillPlusCircle } from "react-icons/ai";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Calendar from "../components/Calendar";
import ModalCreateUnavailability from "../components/modals/ModalCreateUnavailability";
import { getUnavailabilities } from "../api/services/unavailabilityService";
import IndisponibilidadeDetalhe from "../components/IndisponibilidadeDetalhe";
import { toast } from "react-toastify";

function Indisponibilidade() {
  const [value, setValue] = useState(dayjs());
  const [showModal, setShowModal] = useState(false);
  const [indisponibilidades, setIndisponibilidades] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs(value).month());

  const getIndisponibilidades = async (date) => {
    try {
      const response = await getUnavailabilities(
        true,
        dayjs(date).format("YYYY-MM-DD")
      );
      setIndisponibilidades(response);
    } catch (error) {
      console.error("Erro ao buscar indisponibilidades:", error);
      toast.error("Erro ao buscar indisponibilidades");
    }
  };

  useEffect(() => {
    const newMonth = dayjs(value).month();
    if (newMonth !== currentMonth) {
      setCurrentMonth(newMonth);
      getIndisponibilidades(value);
    }
  }, [value, currentMonth]);

  const handleDateChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <div className={styles.container}>
      <AiFillPlusCircle
        className={styles.add}
        onClick={() => setShowModal(true)}
      />
      <Calendar
        onChange={handleDateChange}
        refreshData={getIndisponibilidades}
        data={indisponibilidades}
        value={value}
      />
      {value && (
        <div className={styles.indisponibilidades}>
          <IndisponibilidadeDetalhe
            indisponibilidades={indisponibilidades}
            setIndisponibilidades={setIndisponibilidades}
            dia={value}
          />
        </div>
      )}
      {showModal && (
        <ModalCreateUnavailability
          onClose={() => setShowModal(false)}
          day={value}
          unavailabilities={indisponibilidades}
          setUnavailabilities={setIndisponibilidades}
        />
      )}
    </div>
  );
}

export default Indisponibilidade;
