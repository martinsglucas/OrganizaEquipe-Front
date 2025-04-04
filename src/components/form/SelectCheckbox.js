import styles from "./SelectCheckbox.module.css";
import Checkbox from "./Checkbox";
import { useState, useEffect } from "react";

function SelectCheckbox({ text, options, info, checked, handleOnChange }) {
  const [selected, setSelected] = useState(checked);

  // Sincronizar o estado 'selected' com a prop 'checked'
  useEffect(() => {
    setSelected(checked.map((item) => item.id));
  }, [checked]);

  const handleSelectionChange = (option) => {
    if (selected.includes(option.id)) {
      // Remove da seleção
      const updatedSelection = selected.filter((id) => id !== option.id);
      setSelected(updatedSelection);
      handleOnChange(updatedSelection); // Atualiza o estado no componente pai
    } else {
      // Adiciona à seleção
      const updatedSelection = [...selected, option.id];
      setSelected(updatedSelection);
      handleOnChange(updatedSelection); // Atualiza o estado no componente pai
    }
  };
  return (
    <div className={styles.container}>
      <span>{text}</span>
      {options.map((option) => (
        <Checkbox
          key={option.id}
          text={option[info]}
          checked={selected.includes(option.id)}
          handleOnChange={() => handleSelectionChange(option)}
          id={option.id}
        />
      ))}
    </div>
  );
}

export default SelectCheckbox;
