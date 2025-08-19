import Modal from "./Modal";
import styles from "./ModalMembersOrg.module.css";
import { FaTrash, FaPlus } from "react-icons/fa";
import { removeMember } from "../../api/services/organizationService";
import { toast } from "react-toastify";
import ModalConfirmation from "./ModalConfirmation";
import { useState } from "react";
import ModalOrganizationInvitation from "./ModalOrganizationInvitation";
import { useOrganization } from "../../context/OrganizationContext";

function ModalMembersOrg({ onClose, members}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const { organization, setOrganization } = useOrganization();

  const handleDeleteMember = (member) => {
    setShowConfirmation(true);
    setMemberToDelete(member);
  };

  const deleteMember = async () => {
    try {
      const newMembers = members.filter(
        (member) => member.id !== memberToDelete.id
      );
      await removeMember(organization.id, { user_id: memberToDelete.id });
      if (organization.admins.some((admin) => admin.id === memberToDelete.id)) {
        const newAdmins = organization.admins.filter(
          (admin) => admin.id !== memberToDelete.id
        );
        setOrganization({ ...organization, admins: newAdmins, members: newMembers });
      } else {
        setOrganization({ ...organization, members: newMembers });
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
        <button onClick={() => setShowInvitation(true)} className={styles.add}>
          <FaPlus />
        </button>
      </div>
      {showConfirmation && (
        <ModalConfirmation
          title={"Excluir membro"}
          message={`Tem certeza que deseja remover ${
            memberToDelete.first_name
          }? ${
            organization.admins.some((admin) => admin.id === memberToDelete.id)
              ? "Ele(a) é um administrador e perderá todas as permissões."
              : ""
          }`}
          onConfirm={() => deleteMember()}
          onClose={() => setShowConfirmation(false)}
          noMarginTop={true}
        />
      )}
      {showInvitation && (
        <ModalOrganizationInvitation onClose={() => setShowInvitation(false)} />
      )}
    </Modal>
  );
}

export default ModalMembersOrg;
