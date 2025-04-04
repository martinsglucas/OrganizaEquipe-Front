import { Link } from "react-router-dom";
import styles from "./SidebarItem.module.css";

function SidebarItem({ Icon, Text, to, onClick }) {
  return (
    <Link to={to} className={styles.container} onClick={onClick}>
      <Icon className={styles.svg} />
      {Text}
    </Link>
  );
}

export default SidebarItem;
