import styles from "./ModalCreateOrganization.module.css";
import { useState } from "react";
import Input from "../form/Input";
import Modal from "./Modal";
import { createRequest } from "../../api/services/requestService";
import { useAuth } from "../../context/AuthContext";
import { useOrganization } from "../../context/OrganizationContext";
import { toast } from "react-toastify";
import {
  createOrganization,
  getOrganization,
  getOrganizations,
} from "../../api/services/organizationService";

function ModalCreateOrganization({
  closeModal,
  noMarginTop,
  canCreateOrganization,
}) {
  const [name, setName] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [pendingAction, setPendingAction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [organizationToJoin, setOrganizationToJoin] = useState("");
  const { user } = useAuth();
  const { setOrganization } = useOrganization();

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Informe o nome da organização.");
      return;
    }

    try {
      setPendingAction("create");
      setErrorMessage("");
      const createdOrganization = await createOrganization({ name: name.trim() });
      const organization = await getOrganization(createdOrganization.id);
      setOrganization(organization);
      toast.success("Organização criada com sucesso!");
      closeModal();
    } catch (error) {
      const message =
        error.response?.data?.detail || error.response?.data?.name?.[0];
      setErrorMessage(message || "Não foi possível criar a organização.");
    } finally {
      setPendingAction("");
    }
  };

  const confirm = async (event) => {
    event.preventDefault();
    if (!orgCode.trim()) {
      setErrorMessage("Informe o código de acesso da organização.");
      return;
    }

    try {
      setPendingAction("lookup");
      setErrorMessage("");
      const response = await getOrganizations(false, orgCode.trim());
      if (!response[0]) {
        setErrorMessage("Organização não encontrada.");
        return;
      }
      setOrganizationToJoin(response[0].name);
    } catch {
      setErrorMessage("Não foi possível buscar a organização.");
    } finally {
      setPendingAction("");
    }
  };

  const join = async () => {
    try {
      setPendingAction("join");
      setErrorMessage("");
      await createRequest({
        user: user.id,
        code: orgCode.trim(),
      });
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
      title="Acessar organização"
      noMarginTop={noMarginTop}
      size="sm"
      isBusy={isLoading}
    >
      {errorMessage && (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      )}
      <section className={styles.section} aria-labelledby="join-organization-title">
        <h2 id="join-organization-title">Ingressar por código</h2>
        <p>Use o código compartilhado por uma pessoa administradora.</p>
        <form onSubmit={confirm}>
          <Input
            text="Código de acesso"
            name="orgCode"
            type="text"
            value={orgCode}
            placeholder="Digite o código da organização"
            handleOnChange={(event) => {
              setOrgCode(event.target.value);
              setOrganizationToJoin("");
              setErrorMessage("");
            }}
          />
          <button className={styles.primaryButton} disabled={isLoading}>
            {pendingAction === "lookup" ? "Buscando..." : "Continuar"}
          </button>
        </form>
        {organizationToJoin && (
          <div className={styles.confirmation} aria-live="polite">
            <p>
              Enviar solicitação para <strong>{organizationToJoin}</strong>?
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setOrganizationToJoin("")}
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
      {canCreateOrganization && (
        <section className={styles.section} aria-labelledby="create-organization-title">
          <h2 id="create-organization-title">Criar organização</h2>
          <p>Comece um novo espaço e torne-se responsável por ele.</p>
          <form onSubmit={handleCreate}>
            <Input
              text="Nome da organização"
              name="name"
              type="text"
              value={name}
              placeholder="Digite o nome da organização"
              handleOnChange={(event) => {
                setName(event.target.value);
                setErrorMessage("");
              }}
            />
            <button className={styles.primaryButton} disabled={isLoading}>
              {pendingAction === "create" ? "Criando..." : "Criar organização"}
            </button>
          </form>
        </section>
      )}
    </Modal>
  );
}

export default ModalCreateOrganization;
