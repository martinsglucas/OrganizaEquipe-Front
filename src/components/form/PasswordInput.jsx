import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import styles from "./PasswordInput.module.css";

function PasswordInput({ text, name, placeholder, handleOnChange, value }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className={styles.form_control}>
      <label htmlFor={name}>{text}</label>
      <div className={styles.input_container}>
        <input
          type={isPasswordVisible ? "text" : "password"}
          name={name}
          id={name}
          placeholder={placeholder}
          onChange={handleOnChange}
          value={value}
        />
        <span
          onClick={togglePasswordVisibility}
          className={styles.eye_icon}
          role="button"
          aria-label="Toggle password visibility"
        >
          {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
        </span>
      </div>
    </div>
  );
}

export default PasswordInput;
