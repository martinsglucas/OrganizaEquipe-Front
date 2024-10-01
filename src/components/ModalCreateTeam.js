import styles from "./ModalCreateTeam.module.css";
import { useState } from "react";
import Input from "./form/Input";

function ModalCreateTeam({ closeModal, handleCreateTeam }) {
  const [nomeEquipe, setNomeEquipe] = useState("");

  function handleCreate(e) {
    e.preventDefault();
    handleCreateTeam(nomeEquipe);
  }
  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <h2>Criar nova equipe</h2>

        <Input
          text={"Nome da Equipe"}
          name={"nomeEquipe"}
          type={"text"}
          value={nomeEquipe}
          placeholder={"Digite o nome da equipe"}
          handleOnChange={(e) => setNomeEquipe(e.target.value)}
        />

        <div className={styles.modalButtons}>
          <button className={styles.button_submit} onClick={handleCreate}>
            Criar
          </button>
          <button className={styles.button_cancel} onClick={closeModal}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalCreateTeam;
