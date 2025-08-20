import styles from "./ModalPassword.module.css";
import PasswordInput from "../form/PasswordInput";
import { useState } from "react";
import Modal from "./Modal";
import { toast } from "react-toastify";

function ModalPassword({ closeModal, handlePassword }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleUpdate(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.warn("As senhas precisam ser iguais");
      return;
    }
    handlePassword(password);
  }

  return (
    <Modal isOpen={true} onClose={closeModal} title={"Alterar senha"}>

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
        </div>
      </Modal>
  );
}

export default ModalPassword;
