import styles from "./Footer.module.css";

import { FaCalendarAlt } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { TiHome } from "react-icons/ti";
import { FaBuilding } from "react-icons/fa6";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Footer({ setSidebar }) {
  const location = useLocation();
  const {user} = useAuth();

  const isActive = (path) => location.pathname === path;

  if (!user) {
    return null;
  }

  return (
    <footer className={styles.nav}>
      <Link
        className={`${styles.item} ${isActive("/") ? styles.active : ""}`}
        to="/"
        onClick={() => setSidebar(false)}
      >
        <TiHome />
      </Link>
      <Link
        className={`${styles.item} ${isActive("/escala") ? styles.active : ""}`}
        to="/escala"
        onClick={() => setSidebar(false)}
      >
        <FaCalendarAlt />
      </Link>
      <Link
        className={`${styles.item} ${isActive("/equipe") ? styles.active : ""}`}
        to="/equipe"
        onClick={() => setSidebar(false)}
      >
        <RiTeamFill />
      </Link>
      <Link
        className={`${styles.item} ${
          isActive("/organizacao") ? styles.active : ""
        }`}
        to="/organizacao"
        onClick={() => setSidebar(false)}
      >
        <FaBuilding />
      </Link>
    </footer>
  );
}

export default Footer;
