import styles from "./Loading.module.css";

function Loading({ text = "Carregando" }) {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.loader} aria-hidden="true"></div>
      <span className={styles.visuallyHidden}>{text}</span>
    </div>
  );
}

export default Loading;
