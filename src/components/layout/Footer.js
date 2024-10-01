import styles from "./Footer.module.css";

import { FaCalendarAlt } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { TiHome } from "react-icons/ti";

import { Link, useLocation } from "react-router-dom";

function Footer({ setSidebar }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <footer className={styles.nav}>
      <Link
        className={`${styles.item} ${isActive("/") ? styles.active : ""}`}
        to="/"
        onClick={() => setSidebar(false)}
      >
        <TiHome />
        <span>Início</span>
      </Link>
      <Link
        className={`${styles.item} ${isActive("/escala") ? styles.active : ""}`}
        to="/escala"
        onClick={() => setSidebar(false)}
      >
        <FaCalendarAlt />
        <span>Escala</span>
      </Link>
      <Link
        className={`${styles.item} ${isActive("/equipe") ? styles.active : ""}`}
        to="/equipe"
        onClick={() => setSidebar(false)}
      >
        <RiTeamFill />
        <span>Equipe</span>
      </Link>
    </footer>
  );
}

export default Footer;
