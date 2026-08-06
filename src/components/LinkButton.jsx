import { Link } from "react-router-dom";
import styles from "./LinkButton.module.css";

function LinkButton({ to, text, state }) {
  return (
    <Link className={styles.btn} to={to} state={state}>
      {text}
    </Link>
  );
}

export default LinkButton;
