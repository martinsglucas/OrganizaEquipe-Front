import styles from "./ModalSwapTeam.module.css";
import Modal from "./Modal";
import ModalCreateTeam from "./ModalCreateTeam";
import { useState } from "react";
import { createTeam } from "../../api/services/teamService";

function ModalSwapTeam({ closeModal, handleSwapTeam, equipes }) {
  const [showModal, setShowModal] = useState(false);

  const handleAddTeam = async (nome) => {
    const equipe = await createTeam({ nome });
    handleSwapTeam(equipe);
    setShowModal(false);
    equipes.push(equipe);
  };

  return (
    <Modal isOpen={true} onClose={closeModal} title={"Trocar equipe"}>
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
        <button className={styles.add} onClick={() => setShowModal(true)}>
          <span>+</span>
        </button>
      </div>
      {/* <button className={styles.button_cancel} onClick={closeModal}>
          Cancelar
        </button> */}
      {showModal && (
        <ModalCreateTeam
          closeModal={() => setShowModal(false)}
          handleCreateTeam={handleAddTeam}
          noMarginTop={true}
        />
      )}
    </Modal>
  );
}

export default ModalSwapTeam;
