import styles from "./ModalEditNameOrganization.module.css"
import { useState } from "react";
import Modal from "./Modal"
import ModalLoading from "./ModalLoading";
import Input from "../form/Input";
import { toast } from "react-toastify";
import { useOrganization } from "../../context/OrganizationContext";
import { updateOrganization } from "../../api/services/organizationService";

function ModalEditNameOrganization({onClose}) {

  const {organization, setOrganization} = useOrganization();
  const [name, setName] = useState(organization.name);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnChange = (e) => {
    setName(e.target.value);
  }

  const updateName = async () => {
    try {
      if (name){
        setIsLoading(true);
        await updateOrganization(organization.id, {name});
        setOrganization({...organization, name});
        toast.success("Nome alterado com sucesso!");
        onClose();
      } else {
        toast.warn("A organização precisa de um nome válido!")
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={"Nome da Organização"}>
      <Input
        name={"name"}
        // text={"Nome"}
        type={"text"}
        value={name}
        handleOnChange={handleOnChange}
        placeholder={"Digite o nome da organização"}
      />
      <button className={styles.btn} onClick={updateName}>
        Alterar
      </button>
      {isLoading && <ModalLoading isOpen={isLoading} />}
    </Modal>
  );
}

export default ModalEditNameOrganization;