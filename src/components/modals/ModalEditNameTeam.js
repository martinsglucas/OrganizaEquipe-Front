import styles from "./ModalEditNameTeam.module.css"
import { useEquipe } from "../../context/EquipeContext";
import { useState } from "react";
import { updateTeam } from "../../api/services/teamService";
import Modal from "./Modal"
import Input from "../form/Input";
import { toast } from "react-toastify";

function ModalEditNameTeam({onClose}) {

  const {equipe, setEquipe} = useEquipe();
  const [nome, setNome] = useState(equipe.nome);

  const handleOnChange = (e) => {
    setNome(e.target.value);
  }

  const updateName = async () => {
    try {
      if (nome){
        await updateTeam(equipe.id, {nome});
        setEquipe({...equipe, nome});
        toast.success("Nome alterado com sucesso!");
        onClose();
      } else {
        toast.warn("A equipe precisa de um nome válido!")
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={"Nome da Equipe"}>
      <Input
        name={"nome"}
        // text={"Nome"}
        type={"text"}
        value={nome}
        handleOnChange={handleOnChange}
        placeholder={"Digite o nome da equipe"}
      />
      <button className={styles.btn} onClick={updateName}>Alterar</button>
    </Modal>
  );
}

export default ModalEditNameTeam;