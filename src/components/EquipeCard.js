import styles from "./EquipeCard.module.css";

function EquipeCard({ equipe, handleOnClick }) {
  return (
    <button type="button" className={styles.card} onClick={handleOnClick}>
      <h3>{equipe.nome}</h3>
    </button>
  );
}

export default EquipeCard;
