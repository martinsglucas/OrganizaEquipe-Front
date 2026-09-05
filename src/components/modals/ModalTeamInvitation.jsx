import styles from "./ModalTeamInvitation.module.css";
import Modal from "./Modal";
import Input from "../form/Input";
import { useState } from "react";
import { useTeam } from "../../context/TeamContext";
import { createTeamInvitation } from "../../api/services/teamInvitationService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

function ModalTeamInvitation({ onClose }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { team } = useTeam();
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
      await createTeamInvitation({
        recipient_email: email.trim(),
        sender_name: user.first_name,
        team: team.id,
      });
      toast.success("Convite enviado com sucesso!");
      onClose();
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.recipient_email?.[0] ||
          error.response.data?.team?.[0] ||
          error.response.data?.user?.[0] ||
          "Erro ao enviar convite";
        if (errorMessage.includes("já faz parte dessa equipe")) {
          toast.info(errorMessage);
          setErrorMessage(errorMessage);
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

export default ModalTeamInvitation;
