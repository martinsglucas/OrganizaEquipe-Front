import styles from "./EditUser.module.css";
import { useState } from "react";

import Input from "./form/Input";
import SubmitButton from "./form/SubmitButton";
import ModalPassword from "./modals/ModalPassword";

function EditUser({ user, handleUser, handlePassword, cancel }) {
  function handleUpdate(e) {
    e.preventDefault();
    handleUser(user.id, name, email);
  }

  const [name, setName] = useState(user ? user.first_name : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [showModal, setShowModal] = useState(false);

  return (
    <form className={styles.form} onSubmit={handleUpdate}>
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

      <button
        type="button"
        className={styles.button_password}
        onClick={() => {
          setShowModal(true);
        }}
      >
        Alterar senha
      </button>

      <div className={styles.buttons}>
        <button
          type="button"
          className={styles.button_cancel}
          onClick={() => cancel(false)}
        >
          Cancelar
        </button>
        <SubmitButton text={"Salvar"} />
      </div>
      {showModal && (
        <ModalPassword
          closeModal={() => {
            setShowModal(false);
          }}
          handlePassword={handlePassword}
        />
      )}
    </form>
  );
}

export default EditUser;
