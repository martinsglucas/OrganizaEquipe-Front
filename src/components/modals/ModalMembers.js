import Modal from "./Modal";
import styles from "./ModalMembers.module.css";
import { FaTrash, FaPlus } from "react-icons/fa";
import { removeMember } from "../../api/services/teamService";
import { toast } from "react-toastify";
import { useEquipe } from "../../context/EquipeContext";
import ModalConfirmation from "./ModalConfirmation";
import { useState } from "react";
import ModalInvitation from "./ModalInvitation";

function ModalMembers({ onClose, members}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const { equipe, setEquipe } = useEquipe();

  const handleDeleteMember = (member) => {
    setShowConfirmation(true);
    setMemberToDelete(member);
  };

  const deleteMember = async () => {
    try {
      const newMembers = members.filter(
        (member) => member.id !== memberToDelete.id
      );
      await removeMember(equipe.id, { user_id: memberToDelete.id });
      if (equipe.administradores.some((admin) => admin.id === memberToDelete.id)) {
        const newAdmins = equipe.administradores.filter(
          (admin) => admin.id !== memberToDelete.id
        );
        setEquipe({ ...equipe, administradores: newAdmins, membros: newMembers });
      } else {
        setEquipe({ ...equipe, membros: newMembers });
      }
      toast.success("Membro removido com sucesso!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover membro!");
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={"Membros"}>
      <div className={styles.members}>
        {members.map((member) => (
          <div className={styles.member} key={member.id}>
            <span>{member.first_name}</span>
            <FaTrash
              onClick={() => {
                handleDeleteMember(member);
              }}
              className={styles.delete}
            />
          </div>
        ))}
        <button onClick={() => setShowInvitation(true)} className={styles.add}><FaPlus/></button>
      </div>
      {showConfirmation && (
        <ModalConfirmation
          title={"Excluir membro"}
          message={`Tem certeza que deseja remover ${memberToDelete.first_name}? ${equipe.administradores.some(
            (admin) => admin.id === memberToDelete.id
          ) ? "Ele(a) é um administrador e perderá todas as permissões." : ""}`}
          onConfirm={() => deleteMember()}
          onClose={() => setShowConfirmation(false)}
          noMarginTop={true}
        />
      )}
      {showInvitation && (
        <ModalInvitation onClose={() => setShowInvitation(false)} />
      )}
    </Modal>
  );
}

export default ModalMembers;
