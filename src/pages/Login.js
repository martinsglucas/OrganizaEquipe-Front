import styles from "./Login.module.css";
import FormUser from "../components/FormUser";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/services/userService";
import LinkButton from "../components/LinkButton";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ModalLoading from "../components/modals/ModalLoading";
import { useState } from "react";

function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email, password) => {
    try {
      if (!email || !password) {
        toast.error("Preencha todos os campos.");
        return;
      }
      setIsLoading(true);
      const { user } = await loginUser({
        email,
        password,
      });

      setUser(user);

      navigate("/");

      console.log("Login realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <FormUser type={"login"} handle={handleLogin} />
      <p>
        Não possui conta? <LinkButton to={"/cadastro"} text={"Cadastre-se"} />
      </p>
      {isLoading && <ModalLoading isOpen={isLoading} />}
    </div>
  );
}

export default Login;
