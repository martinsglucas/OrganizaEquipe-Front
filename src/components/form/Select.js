import styles from "./Select.module.css";

function Select({ text, name, options, handleOnChange, value }) {
  return (
    <div className={styles.container}>
      {/* <label htmlFor={name}>{text}</label> */}
      <select
        id={name}
        name={name}
        onChange={handleOnChange}
        value={value || ""}
      >
        <option>{text}</option>
        {options.map((option) => (
          <option value={option.id} key={option.id}>
            {option.nome}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
