import styles from "./FormUser.module.css";
import { useState } from "react";

import Input from "./form/Input";
import PasswordInput from "./form/PasswordInput";
import SubmitButton from "./form/SubmitButton";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import { toast } from "react-toastify";

function FormUser({ type, handle }) {
  function handleLogin(e) {
    e.preventDefault();
    handle(email, password);
  }
  function handleCadastro(e) {
    e.preventDefault();
    if (!passwordMinLength) {
      toast.error("A senha deve ter no mínimo 8 caracteres.");
      return;
    }
    if (!passwordLeastOneLetter) {
      toast.error("A senha deve ter no mínimo uma letra.");
      return;
    }
    handle(name, email, password);
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordLeastOneLetter, setPasswordLeastOneLetter] = useState(false);
  const [iconPasswordLeastOneLetter, setIconPasswordLeastOneLetter] = useState(<MdCancel className={styles.not_check}/>);
  const [passwordMinLength, setPasswordMinLength] = useState(false);
  const [iconPasswordMinLength, setIconPasswordMinLength] = useState(<MdCancel className={styles.not_check}/>);

  const validatePassword = (pwd) => {
    if (pwd.length >= 8) {
      setPasswordMinLength(true);
      setIconPasswordMinLength(<MdCheckCircle className={styles.check}/>);
    } else {
      setPasswordMinLength(false);
      setIconPasswordMinLength(<MdCancel className={styles.not_check}/>);
    }

    if (/[a-zA-Z]/.test(pwd)) {
      setPasswordLeastOneLetter(true);
      setIconPasswordLeastOneLetter(<MdCheckCircle className={styles.check}/>);
    } else {
      setPasswordLeastOneLetter(false);
      setIconPasswordLeastOneLetter(<MdCancel className={styles.not_check}/>);
    }
  };

  const handlePasswordChange = (pwd) => {
    setPassword(pwd);
    validatePassword(pwd);
  };

  return (
    <>
      {type === "cadastro" && (
        <form className={styles.form} onSubmit={handleCadastro}>
          <Input
            text={"Nome"}
            name={"name"}
            type={"text"}
            placeholder={"Digite seu nome"}
            handleOnChange={(e) => setName(e.target.value)}
            value={name}
          />
          <Input
            text={"Email"}
            name={"email"}
            type={"email"}
            placeholder={"Digite seu email"}
            handleOnChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <PasswordInput
            text={"Senha"}
            name={"password"}
            placeholder={"Digite sua senha"}
            handleOnChange={(e) => handlePasswordChange(e.target.value)}
            value={password}
          />
          <div className={styles.passwordInfo}>
            <span className={styles.info}>{iconPasswordMinLength}A senha deve ter no mínimo 8 caracteres.</span>
            <span className={styles.info}>{iconPasswordLeastOneLetter}A senha deve ter no mínimo uma letra.</span>
          </div>
          <SubmitButton text={"Cadastrar"} />
        </form>
      )}
      {type === "login" && (
        <form className={styles.form} onSubmit={handleLogin}>
          <Input
            text={"Email"}
            name={"email"}
            type={"email"}
            placeholder={"Digite seu email"}
            handleOnChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <PasswordInput
            text={"Senha"}
            name={"password"}
            placeholder={"Digite sua senha"}
            handleOnChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <SubmitButton text={"Entrar"} />
        </form>
      )}
    </>
  );
}

export default FormUser;
