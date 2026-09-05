import styles from "./ModalCreateTeam.module.css";
import { useState } from "react";
import Input from "../form/Input";
import Modal from "./Modal";
import { createTeam, getTeams, requestTeamJoin } from "../../api/services/teamService";
import { toast } from "react-toastify";
import { useOrganization } from "../../context/OrganizationContext";
import { useTeam } from "../../context/TeamContext";

function ModalCreateTeam({ closeModal, onClose, noMarginTop, onJoinRequested }) {
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [teamToJoin, setTeamToJoin] = useState("");
  const { organization, admin } = useOrganization();
  const [pendingAction, setPendingAction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { teams, setTeams } = useTeam();

  const addTeam = async (event) => {
    event.preventDefault();
    try {
      if (teamName.trim() === "") {
        setErrorMessage("Informe um nome de equipe válido.");
        return;
      }
      setPendingAction("create");
      setErrorMessage("");
      const team = await createTeam({ name: teamName.trim(), organization: organization.id });
      setTeams([...teams, team]);
      toast.success("Equipe criada com sucesso!");
      onClose();
    } catch {
      setErrorMessage("Não foi possível criar a equipe.");
    } finally {
      setPendingAction("");
    }
  };

  const confirm = async (event) => {
    event.preventDefault();
    try {
      if (teamCode.trim() === "") {
        setErrorMessage("Informe um código de equipe válido.");
        return;
      }
      setPendingAction("lookup");
      setErrorMessage("");
      const response = await getTeams(false, teamCode.trim());
      if (!response[0]) {
        setErrorMessage("Equipe não encontrada nesta organização.");
        return;
      }
      setTeamToJoin(response[0]);
    } catch {
      setErrorMessage("Não foi possível buscar a equipe.");
    } finally {
      setPendingAction("");
    }
  };

  const join = async () => {
    try {
      setPendingAction("join");
      setErrorMessage("");
      const response = await requestTeamJoin(teamToJoin.id);
      onJoinRequested?.(response);
      toast.success("Solicitação enviada com sucesso!");
      closeModal();
    } catch {
      setErrorMessage("Não foi possível enviar a solicitação.");
    } finally {
      setPendingAction("");
    }
  };

  const isLoading = Boolean(pendingAction);

  return (
    <Modal
      isOpen={true}
      onClose={closeModal}
      title={"Ingressar em equipe"}
      noMarginTop={noMarginTop}
      size="sm"
      isBusy={isLoading}
    >
      {errorMessage && (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      )}
      <section className={styles.section} aria-labelledby="join-team-title">
        <h2 id="join-team-title">Ingressar por código</h2>
        <p>Use o código compartilhado por uma pessoa administradora.</p>
        <form onSubmit={confirm}>
          <Input
            text="Código de acesso"
            name="teamCode"
            type="text"
            value={teamCode}
            placeholder="Digite o código da equipe"
            handleOnChange={(event) => {
              setTeamCode(event.target.value);
              setTeamToJoin("");
              setErrorMessage("");
            }}
          />
          <button className={styles.primaryButton} disabled={isLoading}>
            {pendingAction === "lookup" ? "Buscando..." : "Continuar"}
          </button>
        </form>
        {teamToJoin && (
          <div className={styles.confirmation} aria-live="polite">
            <p>
              Enviar solicitação para <strong>{teamToJoin.name}</strong>?
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setTeamToJoin("")}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={join}
                disabled={isLoading}
              >
                {pendingAction === "join" ? "Enviando..." : "Enviar solicitação"}
              </button>
            </div>
          </div>
        )}
      </section>
      {admin && (
        <section className={styles.section} aria-labelledby="create-team-title">
          <h2 id="create-team-title">Criar equipe</h2>
          <p>Adicione uma equipe à organização atual.</p>
          <form onSubmit={addTeam}>
            <Input
              text="Nome da equipe"
              name="teamName"
              type="text"
              value={teamName}
              placeholder="Digite o nome da equipe"
              handleOnChange={(event) => {
                setTeamName(event.target.value);
                setErrorMessage("");
              }}
            />
            <button className={styles.primaryButton} disabled={isLoading}>
              {pendingAction === "create" ? "Criando..." : "Criar equipe"}
            </button>
          </form>
        </section>
      )}
    </Modal>
  );
}

export default ModalCreateTeam;
