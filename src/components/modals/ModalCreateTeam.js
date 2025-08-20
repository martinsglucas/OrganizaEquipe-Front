import styles from "./ModalCreateTeam.module.css";
import { useState } from "react";
import Input from "../form/Input";
import Modal from "./Modal";
import ModalConfirmation from "./ModalConfirmation";
import { createRequest } from "../../api/services/requestService";
import { getTeams } from "../../api/services/teamService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useOrganization } from "../../context/OrganizationContext";

function ModalCreateTeam({ closeModal, handleCreateTeam, noMarginTop }) {
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [teamToJoin, setTeamToJoin] = useState("");
  const { organization, admin } = useOrganization();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { user } = useAuth();

  function handleCreate(e) {
    e.preventDefault();
    handleCreateTeam(teamName, organization.id);
  }

  const confirm = async () => {
    try {
      const response = await getTeams(false, teamCode);
      setTeamToJoin(response[0].name);
      setShowConfirmation(true);
    } catch (error) {
      toast.error("Erro ao buscar equipe!");
    }
  };

  const join = async () => {
    try {
      await createRequest({
        user: user.id,
        code: teamCode,
      });
      toast.success("Solicitação enviada com sucesso!");
      closeModal();
    } catch (error) {
      toast.error("Erro ao enviar solicitação!");
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={closeModal}
      title={"Ingressar em equipe"}
      noMarginTop={noMarginTop}
    >
      <Input
        text={"Código de Acesso"}
        name={"teamCode"}
        type={"text"}
        value={teamCode}
        placeholder={"Digite o código da equipe"}
        handleOnChange={(e) => setTeamCode(e.target.value)}
      />
      <button className={styles.button_submit} onClick={confirm}>
        Enviar solicitação
      </button>
      {admin && <>
      <h2>OU</h2>
      <h1 style={{ marginTop: 0 }}>Criar equipe</h1>
      <Input
        text={"Nome da Equipe"}
        name={"teamName"}
        type={"text"}
        value={teamName}
        placeholder={"Digite o nome da equipe"}
        handleOnChange={(e) => setTeamName(e.target.value)}
      />
      <button className={styles.button_submit} onClick={handleCreate}>
        Criar
      </button>
      </>}
      {showConfirmation && (
        <ModalConfirmation
          title={"Enviar solicitação"}
          message={`Tem certeza que deseja enviar solicitação para a equipe ${teamToJoin}`}
          onClose={() => setShowConfirmation(false)}
          onConfirm={join}
          noMarginTop={true}
        />
      )}
    </Modal>
  );
}

export default ModalCreateTeam;
