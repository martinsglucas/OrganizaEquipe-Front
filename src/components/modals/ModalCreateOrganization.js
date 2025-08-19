import styles from "./ModalCreateOrganization.module.css";
import { useState } from "react";
import Input from "../form/Input";
import Modal from "./Modal";
import ModalConfirmation from "./ModalConfirmation";
import { createRequest } from "../../api/services/requestService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { createOrganization, getOrganization, getOrganizations } from "../../api/services/organizationService";
import { useOrganization } from "../../context/OrganizationContext";

function ModalCreateOrganization({ closeModal, noMarginTop }) {
  const [name, setName] = useState("");
  const [codigoOrg, setCodigoOrg] = useState("");
  const [organizationToJoin, setOrganizationToJoin] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { user } = useAuth();
  const { setOrganization } = useOrganization();

  const handleCreate = async () => {
    try {
      const response = await createOrganization({
        name: name,
        members: [user.id],
        admins: [user.id]
      });
      const organization = await getOrganization(response.id);
      setOrganization(organization);
      toast.success("Organização criada com sucesso!");
      closeModal();
    } catch (error) {
      toast.error("Erro ao criar organização!");
    }
  };
  const confirm = async () => {
    try {
      const response = await getOrganizations(false, codigoOrg);
      setOrganizationToJoin(response[0].name);
      setShowConfirmation(true);
    } catch (error) {
      toast.error("Erro ao buscar equipe!");
    }
  };

  const join = async () => {
    try {
      await createRequest({
        user: user.id,
        code: codigoOrg,
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
      title={"Ingressar"}
      noMarginTop={noMarginTop}
    >
      <Input
        text={"Código de Acesso"}
        name={"codigoOrg"}
        type={"text"}
        value={codigoOrg}
        placeholder={"Digite o código da organização"}
        handleOnChange={(e) => setCodigoOrg(e.target.value)}
      />
      <button className={styles.button_submit} onClick={confirm}>
        Enviar solicitação
      </button>
      <h2>OU</h2>
      <h1 style={{ marginTop: 0 }}>Criar organização</h1>
      <Input
        text={"Nome da Organização"}
        name={"name"}
        type={"text"}
        value={name}
        placeholder={"Digite o nome da organização"}
        handleOnChange={(e) => setName(e.target.value)}
      />
      <button className={styles.button_submit} onClick={handleCreate}>
        Criar
      </button>
      {showConfirmation && (
        <ModalConfirmation
          title={"Enviar solicitação"}
          message={`Tem certeza que deseja enviar solicitação para a organização ${organizationToJoin}`}
          onClose={() => setShowConfirmation(false)}
          onConfirm={join}
          noMarginTop={true}
        />
      )}
    </Modal>
  );
}

export default ModalCreateOrganization;
