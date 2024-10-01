import styles from "./ModalPassword.module.css";
import PasswordInput from "./form/PasswordInput";
import { useState } from "react";

function ModalPassword({ closeModal, handlePassword }) {
  function handleUpdate(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Senhas não conferem");
      return;
    }
    handlePassword(password);
    console.log("senha atualizada");
  }
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <h2>Alterar senha</h2>

        {/* <Input
          text={"Senha atual"}
          name={"current_password"}
          type={"password"}
          placeholder={"Digite sua senha atual"}

        /> */}

        <PasswordInput
          text={"Nova senha"}
          name={"password"}
          placeholder={"Digite sua nova senha"}
          value={password}
          handleOnChange={(e) => setPassword(e.target.value)}
        />

        <PasswordInput
          text={"Confirmar senha"}
          name={"confirmPassword"}
          placeholder={"Confirme sua nova senha"}
          value={confirmPassword}
          handleOnChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className={styles.modalButtons}>
          <button className={styles.button_submit} onClick={handleUpdate}>
            Alterar
          </button>
          <button className={styles.button_cancel} onClick={closeModal}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalPassword;
