import styles from "./ModalInvitation.module.css"
import Modal from "./Modal";
import Input from "../form/Input";
import { useState } from "react";
import { useEquipe } from "../../context/EquipeContext";
import { createInvitation } from "../../api/services/invitationService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

function ModalInvitation({onClose}) {

  const [email, setEmail] = useState("");
  const { equipe } = useEquipe();
  const { user } = useAuth();

  const invite = async () => {
    try {
      await createInvitation({email_destinatario: email, nome_remetente: user.first_name, equipe: equipe.id})
      toast.success("Convite enviado com sucesso!");
      onClose();
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.email_destinatario?.[0] ||
          "Erro ao enviar convite";
        if (errorMessage.includes("já faz parte dessa equipe")){
          toast.info(errorMessage);
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("Erro ao enviar convite");
      }
    }
  }

  return ( 
    <Modal isOpen={true} title={"Enviar Convite"} onClose={onClose} noMarginTop={true}>
      <Input name={"email"} type={"email"} text={"Email"} value={email} handleOnChange={(e) => setEmail(e.target.value)} placeholder={"Digite o email do convidado"}/>
      <button className={styles.button} onClick={invite}>Convidar</button>
    </Modal>
   );
}

export default ModalInvitation;