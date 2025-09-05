import styles from "./ModalChangeTeam.module.css";
import Modal from "./Modal";
import ModalCreateTeam from "./ModalCreateTeam";
import { useState } from "react";
import { createTeam } from "../../api/services/teamService";
import { useOrganization } from "../../context/OrganizationContext";

function ModalChangeTeam({ closeModal, handleChangeTeam, teams }) {
  const [showModal, setShowModal] = useState(false);
  const { organization } = useOrganization();

  const handleAddTeam = async (name) => {
    const team = await createTeam({ name, organization: organization.id });
    handleChangeTeam(team);
    setShowModal(false);
    teams.push(team);
  };

  return (
    <Modal isOpen={true} onClose={closeModal} title={"Trocar equipe"}>
      <div className={styles.teams}>
        {teams.map((team) => (
          <button
            key={team.id}
            className={styles.team}
            onClick={() => handleChangeTeam(team)}
          >
            {team.name}
          </button>
        ))}
        <button className={styles.add} onClick={() => setShowModal(true)}>
          <span>+</span>
        </button>
      </div>
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

export default ModalChangeTeam;
