import styles from "./DateInput.module.css";

function DateInput({ name, value, placeholder, onChange }) {
  const handleOnChange = (event) => {
    onChange(event.target.value);
  };
  return (
    <input
      className={styles.input}
      type="date"
      name={name}
      value={value}
      onChange={handleOnChange}
      placeholder={placeholder}
    />
  );
}

export default DateInput;
