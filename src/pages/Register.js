import { useNavigate } from "react-router-dom";
import { createUser } from "../api/services/userService";
import FormUser from "../components/FormUser";
import styles from "./Register.module.css";
import LinkButton from "../components/LinkButton";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const handleCadastro = async (first_name, email, password) => {
    try {
      const response = await createUser({
        first_name,
        email,
        password,
      });
      console.log("Usuário cadastrado com sucesso!", response);
      toast.success("Conta criada com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer cadastro:", error);
    }
  };
  return (
    <div className={styles.container}>
      <h1>Cadastro</h1>
      <FormUser type={"cadastro"} handle={handleCadastro} />
      <p>
        Já possui conta? <LinkButton to={"/login"} text={"Entrar"} />
      </p>
    </div>
  );
}

export default Register;
