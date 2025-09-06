import styles from "./ModalCreateTeam.module.css";
import { useState } from "react";
import Input from "../form/Input";
import Modal from "./Modal";
import ModalConfirmation from "./ModalConfirmation";
import ModalLoading from "./ModalLoading";
import { createTeam } from "../../api/services/teamService";
import { createRequest } from "../../api/services/requestService";
import { getTeams } from "../../api/services/teamService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useOrganization } from "../../context/OrganizationContext";
import { useTeam } from "../../context/TeamContext";

function ModalCreateTeam({ closeModal, onClose, noMarginTop }) {
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [teamToJoin, setTeamToJoin] = useState("");
  const { organization, admin } = useOrganization();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { teams, setTeams } = useTeam();

  const addTeam = async () => {
    try {
      if (teamName.trim() === "") {
        toast.warn("Por favor, insira um nome de equipe válido.");
        return;
      }
      setIsLoading(true);
      const team = await createTeam({ name: teamName, organization: organization.id });
      setTeams([...teams, team]);
      toast.success("Equipe criada com sucesso!");
      onClose()
    } catch (error) {
      toast.error("Erro ao criar equipe!");
      // throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const confirm = async () => {
    try {
      if (teamCode.trim() === "") {
        toast.warn("Por favor, insira um código de equipe válido.");
        return;
      }
      const response = await getTeams(false, teamCode);
      setTeamToJoin(response[0].name);
      setShowConfirmation(true);
    } catch (error) {
      toast.error("Erro ao buscar equipe!");
    }
  };

  const join = async () => {
    try {
      setIsLoading(true);
      await createRequest({
        user: user.id,
        code: teamCode,
      });
      toast.success("Solicitação enviada com sucesso!");
      closeModal();
    } catch (error) {
      toast.error("Erro ao enviar solicitação!");
    } finally {
      setIsLoading(false);
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
      {admin && (
        <>
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
          <button className={styles.button_submit} onClick={addTeam}>
            Criar
          </button>
        </>
      )}
      {showConfirmation && (
        <ModalConfirmation
          title={"Enviar solicitação"}
          message={`Tem certeza que deseja enviar solicitação para a equipe ${teamToJoin}`}
          onClose={() => setShowConfirmation(false)}
          onConfirm={join}
          noMarginTop={true}
        />
      )}
      {isLoading && <ModalLoading isOpen={isLoading} />}
    </Modal>
  );
}

export default ModalCreateTeam;
