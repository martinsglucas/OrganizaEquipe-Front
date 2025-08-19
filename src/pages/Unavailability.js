import styles from "./Unavailability.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Calendar from "../components/Calendar";
import ModalCreateUnavailability from "../components/modals/ModalCreateUnavailability";
import { getUnavailabilities } from "../api/services/unavailabilityService";
import UnavailabilityDetail from "../components/UnavailabilityDetail";
import { toast } from "react-toastify";

function Unavailability() {
  const [value, setValue] = useState(dayjs());
  const [showModal, setShowModal] = useState(false);
  const [unavailabilities, setUnavailabilities] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs(value).month());

  const getUnavailability = async (date) => {
    try {
      const response = await getUnavailabilities(
        true,
        dayjs(date).format("YYYY-MM-DD")
      );
      setUnavailabilities(response);
    } catch (error) {
      console.error("Erro ao buscar indisponibilidades:", error);
      toast.error("Erro ao buscar indisponibilidades");
    }
  };

  useEffect(() => {
    const newMonth = dayjs(value).month();
    if (newMonth !== currentMonth) {
      setCurrentMonth(newMonth);
      getUnavailability(value);
    }
  }, [value, currentMonth]);

  const handleDateChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <div className={styles.container}>
      <AiOutlinePlus
        className={styles.add}
        onClick={() => setShowModal(true)}
      />
      <Calendar
        onChange={handleDateChange}
        refreshData={getUnavailability}
        data={unavailabilities}
        value={value}
      />
      {value && (
        <div className={styles.unavailabilities}>
          <UnavailabilityDetail
            unavailabilities={unavailabilities}
            setUnavailabilities={setUnavailabilities}
            day={value}
          />
        </div>
      )}
      {showModal && (
        <ModalCreateUnavailability
          onClose={() => setShowModal(false)}
          day={value}
          unavailabilities={unavailabilities}
          setUnavailabilities={setUnavailabilities}
        />
      )}
    </div>
  );
}

export default Unavailability;
