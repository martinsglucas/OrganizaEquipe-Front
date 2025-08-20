import styles from "./TeamCard.module.css";

function TeamCard({ team, handleOnClick }) {
  return (
    <button type="button" className={styles.card} onClick={handleOnClick}>
      <h3>{team.name}</h3>
    </button>
  );
}

export default TeamCard;
