import styles from "./ModalCreateTeam.module.css";
import { useState } from "react";
import Input from "../form/Input";
import Modal from "./Modal";
import ModalConfirmation from "./ModalConfirmation";
import { createRequest } from "../../api/services/requestService";
import { getTeams } from "../../api/services/teamService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

function ModalCreateTeam({ closeModal, handleCreateTeam, noMarginTop }) {
  const [nomeEquipe, setNomeEquipe] = useState("");
  const [codigoEquipe, setCodigoEquipe] = useState("");
  const [equipeToJoin, setEquipeToJoin] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { user } = useAuth();

  function handleCreate(e) {
    e.preventDefault();
    handleCreateTeam(nomeEquipe);
  }

  const confirm = async () => {
    try {
      const response = await getTeams(false, codigoEquipe);
      setEquipeToJoin(response[0].name);
      setShowConfirmation(true);
    } catch (error) {
      toast.error("Erro ao buscar equipe!");
    }
  };

  const join = async () => {
    try {
      await createRequest({
        user: user.id,
        code: codigoEquipe,
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
        name={"codigoEquipe"}
        type={"text"}
        value={codigoEquipe}
        placeholder={"Digite o código da equipe"}
        handleOnChange={(e) => setCodigoEquipe(e.target.value)}
      />
      <button className={styles.button_submit} onClick={confirm}>
        Enviar solicitação
      </button>
      <h2>OU</h2>
      <h1 style={{ marginTop: 0 }}>Criar equipe</h1>
      <Input
        text={"Nome da Equipe"}
        name={"nomeEquipe"}
        type={"text"}
        value={nomeEquipe}
        placeholder={"Digite o nome da equipe"}
        handleOnChange={(e) => setNomeEquipe(e.target.value)}
      />
      <button className={styles.button_submit} onClick={handleCreate}>
        Criar
      </button>
      {showConfirmation && (
        <ModalConfirmation
          title={"Enviar solicitação"}
          message={`Tem certeza que deseja enviar solicitação para a equipe ${equipeToJoin}`}
          onClose={() => setShowConfirmation(false)}
          onConfirm={join}
          noMarginTop={true}
        />
      )}
    </Modal>
  );
}

export default ModalCreateTeam;
