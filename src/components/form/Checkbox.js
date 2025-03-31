import styles from "./Checkbox.module.css";

function Checkbox({ text, checked, handleOnChange, id }) {
  return (
    <div className={styles.checkbox}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleOnChange}
      />
      <label htmlFor={id}>{text}</label>
    </div>
  );
}

export default Checkbox;
