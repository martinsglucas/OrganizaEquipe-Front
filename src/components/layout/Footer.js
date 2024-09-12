import styles from "./Footer.module.css";

import { FaCalendarAlt } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { TiHome } from "react-icons/ti";

import { Link, useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <footer className={styles.nav}>
      <Link
        className={`${styles.item} ${isActive("/") ? styles.active : ""}`}
        to="/"
      >
        <TiHome />
        {/* <span>Início</span> */}
      </Link>
      <Link
        className={`${styles.item} ${isActive("/escala") ? styles.active : ""}`}
        to="/escala"
      >
        <FaCalendarAlt />
        {/* <span>Escala</span> */}
      </Link>
      <Link
        className={`${styles.item} ${
          isActive("/ministerio") ? styles.active : ""
        }`}
        to="/ministerio"
      >
        <RiTeamFill />
        {/* <span>Ministério</span> */}
      </Link>
    </footer>
  );
}

export default Footer;
