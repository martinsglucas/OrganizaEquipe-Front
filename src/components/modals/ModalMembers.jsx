import Modal from "./Modal";
import styles from "./ModalMembers.module.css";
import { FaTrash, FaPlus } from "react-icons/fa";
import { removeMember } from "../../api/services/teamService";
import { toast } from "react-toastify";
import { useTeam } from "../../context/TeamContext";
import ModalConfirmation from "./ModalConfirmation";
import { useState } from "react";
import ModalTeamInvitation from "./ModalTeamInvitation";

function ModalMembers({ onClose, members = [] }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { team, setTeam } = useTeam();

  const handleDeleteMember = (member) => {
    setErrorMessage("");
    setMemberToDelete(member);
    setShowConfirmation(true);
  };

  const deleteMember = async () => {
    try {
      setErrorMessage("");
      const newMembers = members.filter(
        (member) => member.id !== memberToDelete.id
      );
      setIsLoading(true);
      await removeMember(team.id, { user_id: memberToDelete.id });
      if (team.admins.some((admin) => admin.id === memberToDelete.id)) {
        const newAdmins = team.admins.filter(
          (admin) => admin.id !== memberToDelete.id
        );
        setTeam({ ...team, admins: newAdmins, members: newMembers });
      } else {
        setTeam({ ...team, members: newMembers });
      }
      toast.success("Membro removido com sucesso!");
      onClose();
    } catch (error) {
      console.error(error);
      setErrorMessage("Não foi possível remover o membro. Tente novamente.");
      toast.error("Erro ao remover membro!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={"Membros"} isBusy={isLoading}>
      <div className={styles.members}>
        {members.length > 0 ? (
          members.map((member) => (
            <div className={styles.member} key={member.id}>
              <span>{member.first_name}</span>
              <button
                type="button"
                onClick={() => handleDeleteMember(member)}
                className={styles.delete}
                aria-label={`Remover ${member.first_name}`}
                disabled={isLoading}
              >
                <FaTrash aria-hidden="true" />
                <span>Remover</span>
              </button>
            </div>
          ))
        ) : (
          <p className={styles.empty}>Nenhum membro cadastrado.</p>
        )}
        <button
          type="button"
          onClick={() => setShowInvitation(true)}
          className={styles.add}
          disabled={isLoading}
        >
          <FaPlus aria-hidden="true" />
          <span>Convidar membro</span>
        </button>
      </div>
      {showConfirmation && (
        <ModalConfirmation
          title={"Excluir membro"}
          message={
            <>
              {`Tem certeza que deseja remover ${memberToDelete.first_name}? ${
                team.admins.some((admin) => admin.id === memberToDelete.id)
                  ? "Ele(a) é um administrador e perderá todas as permissões."
                  : ""
              }`}
              {errorMessage && (
                <span className={styles.error} role="alert">
                  {errorMessage}
                </span>
              )}
            </>
          }
          onConfirm={() => deleteMember()}
          onClose={() => {
            setShowConfirmation(false);
            setErrorMessage("");
          }}
          noMarginTop={true}
          confirmLabel="Remover membro"
          pendingLabel="Removendo membro..."
          danger
          pending={isLoading}
        />
      )}
      {showInvitation && (
        <ModalTeamInvitation onClose={() => setShowInvitation(false)} />
      )}
    </Modal>
  );
}

export default ModalMembers;
