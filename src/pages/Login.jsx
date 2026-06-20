import styles from "./Login.module.css";
import FormUser from "../components/FormUser";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../api/services/userService";
import LinkButton from "../components/LinkButton";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ModalLoading from "../components/modals/ModalLoading";
import { useState } from "react";

function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (email, password) => {
    if (!email || !password) {
      toast.error("Preencha todos os campos.");
      return;
    }

    try {
      setIsLoading(true);
      const { user } = await loginUser({
        email,
        password,
      });

      setUser(user);
      navigate(from, { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        "Erro ao fazer login";
      toast.error(message);
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
