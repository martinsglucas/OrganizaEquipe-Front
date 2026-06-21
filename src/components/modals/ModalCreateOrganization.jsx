import styles from "./ModalCreateOrganization.module.css";
import { useEffect, useState } from "react";
import Input from "../form/Input";
import Modal from "./Modal";
import ModalConfirmation from "./ModalConfirmation";
import ModalLoading from "./ModalLoading";
import { createRequest } from "../../api/services/requestService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import {
  createOrganizationRequest,
  getOrganizationCreationRequests,
  getOrganizations,
} from "../../api/services/organizationService";

const requestStatusLabels = {
  pending: "Pendente",
  approved: "Aprovada",
  rejected: "Rejeitada",
};

function ModalCreateOrganization({ closeModal, noMarginTop }) {
  const [name, setName] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [organizationToJoin, setOrganizationToJoin] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [creationRequests, setCreationRequests] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadCreationRequests = async () => {
      try {
        const requests = await getOrganizationCreationRequests();
        setCreationRequests(requests);
      } catch (error) {
        toast.error("Erro ao buscar solicitações de organização!");
      }
    };

    loadCreationRequests();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Informe o nome da organização!");
      return;
    }

    try {
      setIsLoading(true);
      const response = await createOrganizationRequest({ name: name.trim() });
      setCreationRequests((requests) => [response, ...requests]);
      setName("");
      toast.success("Solicitação de criação enviada!");
    } catch (error) {
      const message = error.response?.data?.name?.[0];
      toast.error(message || "Erro ao solicitar criação da organização!");
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
        Solicitar criação
      </button>
      {creationRequests.length > 0 && (
        <section className={styles.requests}>
          <h2>Solicitações de criação</h2>
          <ul>
            {creationRequests.map((request) => (
              <li key={request.id}>
                <span>{request.name}</span>
                <strong className={styles[request.status]}>
                  {requestStatusLabels[request.status] || request.status}
                </strong>
              </li>
            ))}
          </ul>
        </section>
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
