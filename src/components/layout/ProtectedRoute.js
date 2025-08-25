import styles from "./ProtectedRoute.module.css";
import LinkButton from "../LinkButton";
import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import { logoutUser } from "../../api/services/userService";

function ProtectedRoute({ children }) {

  const { isSignedIn, isLoading } = useAuth();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isLoading) {
  //     if (!isSignedIn) {
  //       navigate("/login");
  //     }
  //   }
  // }, [isSignedIn, isLoading]);

  return isSignedIn ? (
    children
  ) : (
    <div className={styles.container}>
      <h1>Acesso restrito</h1>
      <p>Para continuar, entre na sua conta ou crie uma nova.</p>
      <LinkButton to={"/login"} text={"Login"} />
      <LinkButton to={"/cadastro"} text={"Cadastrar-se"} />
    </div>
  );
}

export default ProtectedRoute;
