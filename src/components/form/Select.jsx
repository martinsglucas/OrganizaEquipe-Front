import styles from "./Select.module.css";

function Select({ text, name, options, disabledOptions = [], handleOnChange, value }) {
  return (
    <div className={styles.container}>
      <label htmlFor={name}>{text}</label>
      <select
        id={name}
        name={name}
        onChange={handleOnChange}
        value={value || ""}
      >
        <option value={""} disabled>{`Selecione ${text.toLowerCase()}`}</option>

        {options.map((option) => (
          <option value={option.id} key={option.id}>
            {option.name}
          </option>
        ))}

        {disabledOptions.map((option) => (
          <option value={option.id} key={option.id} disabled>
            {option.name}
          </option>
        ))}

      </select>
    </div>
  );
}

export default Select;
