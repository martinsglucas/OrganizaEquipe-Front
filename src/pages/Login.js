import styles from "./Login.module.css";
import FormUser from "../components/FormUser";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/services/userService";
import LinkButton from "../components/LinkButton";

function Login() {
  const navigate = useNavigate();
  const handleLogin = async (username, password) => {
    try {
      // const response = await loginUser({ username, password });
      await loginUser({
        username,
        password,
      });

      navigate("/");

      console.log("Login realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };
  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <FormUser type={"login"} handle={handleLogin} />
      <p>
        Não possui conta? <LinkButton to={"/cadastro"} text={"Cadastre-se"} />
      </p>
    </div>
  );
}

export default Login;
