import styles from "./ModalEditNameOrganization.module.css"
import { useState } from "react";
import { updateTeam } from "../../api/services/teamService";
import Modal from "./Modal"
import Input from "../form/Input";
import { toast } from "react-toastify";
import { useOrganization } from "../../context/OrganizationContext";
import { updateOrganization } from "../../api/services/organizationService";

function ModalEditNameOrganization({onClose}) {

  const {organization, setOrganization} = useOrganization();
  const [name, setName] = useState(organization.name);

  const handleOnChange = (e) => {
    setName(e.target.value);
  }

  const updateName = async () => {
    try {
      if (name){
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
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={"Nome da Organização"}>
      <Input
        name={"nome"}
        // text={"Nome"}
        type={"text"}
        value={name}
        handleOnChange={handleOnChange}
        placeholder={"Digite o nome da organização"}
      />
      <button className={styles.btn} onClick={updateName}>Alterar</button>
    </Modal>
  );
}

export default ModalEditNameOrganization;