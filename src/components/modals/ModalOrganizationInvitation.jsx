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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { organization } = useOrganization();
  const { user } = useAuth();

  const invite = async (event) => {
    event.preventDefault();

    try {
      setErrorMessage("");
      if (!email.trim()) {
        setErrorMessage("Informe o e-mail da pessoa que deseja convidar.");
        return;
      }
      setIsLoading(true);
      await createOrganizationInvitation({
        recipient_email: email.trim(),
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
          setErrorMessage(errorMessage);
        } else if (errorMessage.includes("não encontrado")) {
          toast.error("Usuário não encontrado");
          setErrorMessage("Nenhum usuário foi encontrado com este e-mail.");
        } else {
          toast.error("Erro ao enviar convite");
          setErrorMessage(errorMessage);
        }
      } else {
        toast.error("Erro ao enviar convite");
        setErrorMessage("Não foi possível enviar o convite. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      title={"Enviar Convite"}
      onClose={onClose}
      noMarginTop={true}
      size="sm"
      isBusy={isLoading}
    >
      <form className={styles.form} onSubmit={invite} aria-busy={isLoading}>
        <Input
          name={"email"}
          type={"email"}
          text={"E-mail"}
          value={email}
          handleOnChange={(e) => setEmail(e.target.value)}
          placeholder={"Digite o e-mail do convidado"}
        />
        {errorMessage && <p className={styles.error} role="alert">{errorMessage}</p>}
        <button className={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? "Enviando convite..." : "Enviar convite"}
        </button>
      </form>
    </Modal>
  );
}

export default ModalOrganizationInvitation;
