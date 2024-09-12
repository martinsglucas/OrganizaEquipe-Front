import styles from "./ProtectedRoute.module.css";
import LinkButton from "../LinkButton";

function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("accessToken");

  return isAuthenticated ? (
    children
  ) : (
    <div className={styles.container}>
      <h1>Acesso não autorizado</h1>
      <p>Faça login ou cadastre-se para continuar.</p>
      <LinkButton to={"/login"} text={"Login"} />
      <LinkButton to={"/cadastro"} text={"Cadastrar-se"} />
    </div>
  );
}

export default ProtectedRoute;
