import styles from "./FormUser.module.css";
import { useState } from "react";

import Input from "./form/Input";
import PasswordInput from "./form/PasswordInput";
import SubmitButton from "./form/SubmitButton";

function FormUser({ type, handle }) {
  function handleLogin(e) {
    e.preventDefault();
    // console.log(`Usuário: ${email} - Senha: ${password}`);
    // console.log("usuario cadastrado");
    handle(username, password);
  }
  function handleCadastro(e) {
    e.preventDefault();
    handle(username, name, email, password);
  }

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      {type === "cadastro" && (
        <form className={styles.form} onSubmit={handleCadastro}>
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
          <PasswordInput
            text={"Senha"}
            name={"password"}
            placeholder={"Digite sua senha"}
            handleOnChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <SubmitButton text={"Cadastrar"} />
        </form>
      )}
      {type === "login" && (
        <form className={styles.form} onSubmit={handleLogin}>
          <Input
            text={"Usuário"}
            name={"username"}
            type={"username"}
            placeholder={"Digite seu usuário"}
            handleOnChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <Input
            text={"Senha"}
            name={"password"}
            type={"password"}
            placeholder={"Digite seu senha"}
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
