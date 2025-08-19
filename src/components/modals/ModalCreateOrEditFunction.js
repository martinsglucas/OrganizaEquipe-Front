import styles from "./ModalCreateOrEditFunction.module.css";
import { useState } from "react";
import Input from "../form/Input";
import Modal from "./Modal";
import { createFunction, updateFunction } from "../../api/services/functionService";
import { useTeam } from "../../context/TeamContext";
import { toast } from "react-toastify";

function ModalCreateOrEditFunction({ title, func, onClose }) {
  const [name, setName] = useState(func ? func.name : "");
  const { team, setTeam } = useTeam();

  const handleCreateFunction = async () => {
    try {
      if (name){
        const newFunction = await createFunction({ team: team.id, name });
        setTeam({ ...team, roles: [...team.roles, newFunction] });
        toast.success("Função criada com sucesso!");
        onClose();
      } else {
        toast.warn("A função precisa de um nome válido!")
      }
    } catch (error) {
      toast.error("Erro ao criar função!");
      console.error(error);
    }
  };

  const handleEditFunction = async () => {
    try {
      if (name){
        const updatedFunction = await updateFunction(func.id, {name});
        setTeam({
          ...team,
          roles: team.roles.map((f) =>
            f.id === func.id ? updatedFunction : f
          ),
        });
        toast.success("Função alterada com sucesso!");
        onClose();
      } else {
        toast.warn("A função precisa de um nome válido!")

      }
    } catch (error) {
      toast.error("Erro ao alterar função!");
      console.error(error);
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={title} noMarginTop={true}>
      <Input
        text="Nome"
        name={"nome"}
        value={name}
        type={"text"}
        handleOnChange={(e) => setName(e.target.value)}
        placeholder={"Digite o nome da função"}
      />
      {func ? (
        <button className={styles.button} onClick={handleEditFunction}>
          Alterar função
        </button>
      ):(
        <button className={styles.button} onClick={handleCreateFunction}>
          Criar função
        </button>
      )}
    </Modal>
  );
}

export default ModalCreateOrEditFunction;