import styles from "./EditUser.module.css";
import { useState } from "react";

import Input from "./form/Input";
import PasswordInput from "./form/PasswordInput";
import SubmitButton from "./form/SubmitButton";
import SelectCheckbox from "./form/SelectCheckbox";

function EditUser({ user, handle, cancel }) {
  function handleUpdate(e) {
    e.preventDefault();
    handle(user.id, username, name, email, password);
  }

  const [username, setUsername] = useState(user ? user.username : "");
  const [name, setName] = useState(user ? user.first_name : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [password, setPassword] = useState("");

  return (
    <form className={styles.form} onSubmit={handleUpdate}>
      <Input
        text={"Usuário"}
        name={"username"}
        type={"username"}
        placeholder={"Digite seu usuário"}
        handleOnChange={(e) => setUsername(e.target.value)}
        value={username}
      />
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
      {/* <Input
            text={"Senha"}
            name={"password"}
            type={"password"}
            placeholder={"Digite seu senha"}
            handleOnChange={(e) => setPassword(e.target.value)}
            value={password}
          /> */}
      {/* <PasswordInput
        text={"Senha"}
        name={"password"}
        placeholder={"Digite sua senha"}
        handleOnChange={(e) => setPassword(e.target.value)}
        value={password}
      /> */}

      <SelectCheckbox
        options={[
          { id: "Teclado", name: "Teclado" },
          { id: "Violão", name: "Violão" },
          { id: "Bateria", name: "Bateria" },
          { id: "Voz", name: "Voz" },
        ]}
      />
      <div className={styles.buttons}>
        <SubmitButton text={"Salvar"} />
        <button
          type="button"
          className={styles.button_cancel}
          onClick={() => cancel(false)}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default EditUser;
