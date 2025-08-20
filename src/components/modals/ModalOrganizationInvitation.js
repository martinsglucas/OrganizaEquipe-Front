import styles from "./ModalOrganizationInvitation.module.css";
import Modal from "./Modal";
import Input from "../form/Input";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useOrganization } from "../../context/OrganizationContext";
import { createOrganizationInvitation } from "../../api/services/organizationInvitationService";

function ModalOrganizationInvitation({ onClose }) {
  const [email, setEmail] = useState("");
  const { organization } = useOrganization();
  const { user } = useAuth();

  const invite = async () => {
    try {
      await createOrganizationInvitation({
        recipient_email: email,
        sender_name: user.first_name,
        organization: organization.id,
      });
      toast.success("Convite enviado com sucesso!");
      onClose();
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.recipient_email?.[0] ||
          error.response.data?.organization?.[0] ||
          error.response.data?.user?.[0] ||
          "Erro ao enviar convite";
        if (errorMessage.includes("já faz parte dessa organização")) {
          toast.info(errorMessage);
        } else if (errorMessage.includes("não encontrado")) {
          toast.error("Usuário não encontrado");
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("Erro ao enviar convite");
      }
    }
  };

  return (
    <Modal
      isOpen={true}
      title={"Enviar Convite"}
      onClose={onClose}
      noMarginTop={true}
    >
      <Input
        name={"email"}
        type={"email"}
        text={"Email"}
        value={email}
        handleOnChange={(e) => setEmail(e.target.value)}
        placeholder={"Digite o email do convidado"}
      />
      <button className={styles.button} onClick={invite}>
        Convidar
      </button>
    </Modal>
  );
}

export default ModalOrganizationInvitation;
