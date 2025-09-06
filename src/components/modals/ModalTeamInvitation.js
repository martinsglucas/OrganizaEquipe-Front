import styles from "./ModalTeamInvitation.module.css";
import Modal from "./Modal";
import ModalLoading from "./ModalLoading";
import Input from "../form/Input";
import { useState } from "react";
import { useTeam } from "../../context/TeamContext";
import { createTeamInvitation } from "../../api/services/teamInvitationService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

function ModalTeamInvitation({ onClose }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { team } = useTeam();
  const { user } = useAuth();

  const invite = async () => {
    try {
      if (!email) {
        toast.warn("Por favor, insira um email válido.");
        return;
      }
      setIsLoading(true);
      await createTeamInvitation({
        recipient_email: email,
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
        } else {
          toast.error("Erro ao enviar convite");
        }
      } else {
        toast.error("Erro ao enviar convite");
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
      {isLoading && <ModalLoading isOpen={isLoading} />}
    </Modal>
  );
}

export default ModalTeamInvitation;
