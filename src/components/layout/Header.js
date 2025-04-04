import styles from "./Header.module.css";
import { FaBars } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

function Header({ sidebar, setSitebar }) {
  const showSidebar = () => setSitebar(!sidebar);

  const location = useLocation();

  const handleTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Início";
      case "/escala":
        return "Escala";
      case "/equipe":
        return "Equipe";
      case "/indisponibilidade":
        return "Indisponibilidade";
      case "/perfil":
        return "Perfil";
      case "/organizacao":
        return "Organização";
      case "/notificacoes":
        return "Notificações"
      default:
        return "";
    }
  };

  const title = handleTitle();

  return (
    <div className={styles.container}>
      <h1 className={styles.nome}>{title}</h1>
      <FaBars className={styles.svg} onClick={showSidebar} />
      {sidebar && <Sidebar active={setSitebar} />}
    </div>
  );
}

export default Header;
