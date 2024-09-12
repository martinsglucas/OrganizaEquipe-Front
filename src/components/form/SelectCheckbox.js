import styles from "./SelectCheckbox.module.css";
import Checkbox from "./Checkbox";
import { useState, useEffect } from "react";

function SelectCheckbox({ options }) {
  const [selected, setSelected] = useState([]);

  // useEffect(() => {
  //   console.log(selected);
  // }, [selected]);

  const handleOnChange = (option) => {
    if (selected.includes(option.id)) {
      setSelected(selected.filter((item) => item !== option.id));
    } else {
      setSelected([...selected, option.id]);
    }
  };
  return (
    <div className={styles.container}>
      <span>Funções</span>
      {options.map((option) => (
        <Checkbox
          key={option.id}
          text={option.name}
          checked={selected.includes(option.id)}
          handleOnChange={() => handleOnChange(option)}
          id={option.id}
        />
      ))}
    </div>
  );
}

export default SelectCheckbox;
