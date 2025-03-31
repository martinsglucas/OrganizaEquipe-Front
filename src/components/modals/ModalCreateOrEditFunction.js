import styles from "./ModalCreateOrEditFunction.module.css";
import { useState } from "react";
import Input from "../form/Input";
import Modal from "./Modal";
import { createFunction, updateFunction } from "../../api/services/functionService";
import { useEquipe } from "../../context/EquipeContext";
import { toast } from "react-toastify";

function ModalCreateOrEditFunction({ title, func, onClose }) {
  const [nome, setNome] = useState(func ? func.nome : "");
  const { equipe, setEquipe } = useEquipe();

  const handleCreateFunction = async () => {
    try {
      if (nome){
        const newFunction = await createFunction({ equipe: equipe.id, nome });
        setEquipe({ ...equipe, funcoes: [...equipe.funcoes, newFunction] });
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
      if (nome){
        const updatedFunction = await updateFunction(func.id, {nome});
        setEquipe({
          ...equipe,
          funcoes: equipe.funcoes.map((f) =>
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
        value={nome}
        type={"text"}
        handleOnChange={(e) => setNome(e.target.value)}
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