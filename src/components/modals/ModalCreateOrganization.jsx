import styles from "./ModalCreateOrganization.module.css";
import { useState } from "react";
import Input from "../form/Input";
import Modal from "./Modal";
import ModalConfirmation from "./ModalConfirmation";
import ModalLoading from "./ModalLoading";
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
  const [isLoading, setIsLoading] = useState(false);
  const [organizationToJoin, setOrganizationToJoin] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { user } = useAuth();
  const { setOrganization } = useOrganization();

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Informe o nome da organização!");
      return;
    }

    try {
      setIsLoading(true);
      const createdOrganization = await createOrganization({ name: name.trim() });
      const organization = await getOrganization(createdOrganization.id);
      setOrganization(organization);
      toast.success("Organização criada com sucesso!");
      closeModal();
    } catch (error) {
      const message =
        error.response?.data?.detail || error.response?.data?.name?.[0];
      toast.error(message || "Erro ao criar organização!");
    } finally {
      setIsLoading(false);
    }
  };
  const confirm = async () => {
    try {
      const response = await getOrganizations(false, orgCode);
      setOrganizationToJoin(response[0].name);
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
        code: orgCode,
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
      title={"Ingressar"}
      noMarginTop={noMarginTop}
    >
      <Input
        text={"Código de Acesso"}
        name={"orgCode"}
        type={"text"}
        value={orgCode}
        placeholder={"Digite o código da organização"}
        handleOnChange={(e) => setOrgCode(e.target.value)}
      />
      <button className={styles.button_submit} onClick={confirm}>
        Enviar solicitação
      </button>
      {canCreateOrganization && (
        <>
          <h2>OU</h2>
          <h1 className={styles.create_org}>Criar organização</h1>
          <Input
            text={"Nome da Organização"}
            name={"name"}
            type={"text"}
            value={name}
            placeholder={"Digite o nome da organização"}
            handleOnChange={(e) => setName(e.target.value)}
          />
          <button className={styles.button_submit} onClick={handleCreate}>
            Criar organização
          </button>
        </>
      )}
      {showConfirmation && (
        <ModalConfirmation
          title={"Enviar solicitação"}
          message={`Tem certeza que deseja enviar solicitação para a organização ${organizationToJoin}`}
          onClose={() => setShowConfirmation(false)}
          onConfirm={join}
          noMarginTop={true}
        />
      )}
      {isLoading && <ModalLoading isOpen={isLoading}/>}
    </Modal>
  );
}

export default ModalCreateOrganization;
