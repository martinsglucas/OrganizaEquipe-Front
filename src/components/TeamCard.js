import styles from "./TeamCard.module.css";

function TeamCard({ equipe, handleOnClick }) {
  return (
    <button type="button" className={styles.card} onClick={handleOnClick}>
      <h3>{equipe.name}</h3>
    </button>
  );
}

export default TeamCard;
