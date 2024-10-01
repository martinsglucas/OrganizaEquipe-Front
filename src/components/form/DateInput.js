import styles from "./DateInput.module.css";
import { useState } from "react";

function DateInput({ name, value, placeholder, handleOnChange }) {
  const [date, setDate] = useState("");

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };
  return (
    <input
      className={styles.input}
      type="date"
      name={name}
      value={date}
      placeholder={placeholder}
      onChange={handleDateChange}
    />
  );
}

export default DateInput;
