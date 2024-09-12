import styles from "./Checkbox.module.css";

function Checkbox({ text, checked, handleOnChange, id }) {
  return (
    <div className={styles.checkbox}>
      <label htmlFor={id}>{text}</label>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleOnChange}
      />
    </div>
  );
}

export default Checkbox;
