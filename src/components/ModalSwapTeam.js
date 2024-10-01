import styles from "./ModalSwapTeam.module.css";

function ModalSwapTeam({ closeModal, handleSwapTeam, equipes }) {
  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <h2>Trocar de equipe</h2>
        <div className={styles.equipes}>
          {equipes.map((equipe) => (
            <button
              key={equipe.id}
              className={styles.equipe}
              onClick={() => handleSwapTeam(equipe)}
            >
              {equipe.nome}
            </button>
          ))}
        </div>
        <button className={styles.button_cancel} onClick={closeModal}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default ModalSwapTeam;
