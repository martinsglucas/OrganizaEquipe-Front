import styles from "./ModalEditNameTeam.module.css"
import { useTeam } from "../../context/TeamContext";
import { useState } from "react";
import { updateTeam } from "../../api/services/teamService";
import Modal from "./Modal"
import ModalLoading from "./ModalLoading";
import Input from "../form/Input";
import { toast } from "react-toastify";

function ModalEditNameTeam({onClose}) {

  const {team, setTeam} = useTeam();
  const [name, setName] = useState(team.name);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnChange = (e) => {
    setName(e.target.value);
  }

  const updateName = async () => {
    try {
      if (name){
        setIsLoading(true);
        await updateTeam(team.id, {name});
        setTeam({...team, name});
        toast.success("Nome alterado com sucesso!");
        onClose();
      } else {
        toast.warn("A equipe precisa de um nome válido!")
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={"Nome da Equipe"}>
      <Input
        name={"name"}
        // text={"Nome"}
        type={"text"}
        value={name}
        handleOnChange={handleOnChange}
        placeholder={"Digite o nome da equipe"}
      />
      <button className={styles.btn} onClick={updateName}>
        Alterar
      </button>
      {isLoading && <ModalLoading isOpen={isLoading} />}
    </Modal>
  );
}

export default ModalEditNameTeam;