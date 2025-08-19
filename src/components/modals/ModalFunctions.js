import Modal from "./Modal";
import styles from "./ModalFunctions.module.css";
import { FaTrash, FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { deleteFunction } from "../../api/services/functionService";
import { toast } from "react-toastify";
import { useTeam } from "../../context/TeamContext";
import ModalConfirmation from "./ModalConfirmation";
import ModalCreateOrEditFunction from "./ModalCreateOrEditFunction";
import { useState } from "react";

function ModalFunctions({ onClose, functions }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCreateFunction, setShowCreateFunction] = useState(false);
  const [functionToDelete, setFunctionToDelete] = useState(null);
  const [functionToEdit, setFunctionToEdit] = useState(null);

  const { equipe, setEquipe } = useTeam();

  const handleDeleteFunction = (func) => {
    setFunctionToDelete(func);
    setShowConfirmation(true);
  };

  const handleEditFunction = (func) => {
    setFunctionToEdit(func);
    setShowCreateFunction(true);
  };

  const removeFunction = async () => {
    try {
      const newFunctions = functions.filter(
        (func) => func.id !== functionToDelete.id
      );
      await deleteFunction(functionToDelete.id);
      setEquipe({ ...equipe, roles: newFunctions });
      toast.success("Função removida com sucesso!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover função!");
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={"Funções"}>
      <div className={styles.functions}>
        {functions.map((func) => (
          <div className={styles.func} key={func.id}>
            <span>{func.name}</span>
            <div className={styles.buttons}>
              <MdEdit
                onClick={() => {
                  handleEditFunction(func);
                }}
                className={styles.edit}
              />
              <FaTrash
                onClick={() => {
                  handleDeleteFunction(func);
                }}
                className={styles.delete}
              />
            </div>
          </div>
        ))}
        <button
          onClick={() => setShowCreateFunction(true)}
          className={styles.add}
        >
          <FaPlus />
        </button>
      </div>
      {showConfirmation && (
        <ModalConfirmation
          title={"Excluir função"}
          message={`Tem certeza que deseja remover a função ${functionToDelete.name}?`}
          onConfirm={() => removeFunction()}
          onClose={() => setShowConfirmation(false)}
          noMarginTop={true}
        />
      )}
      {showCreateFunction && (
        <ModalCreateOrEditFunction
          title={functionToEdit ? "Editar função" : "Criar função"}
          func={functionToEdit}
          onClose={() => {
            setShowCreateFunction(false);
            setFunctionToEdit(null);
          }}
        />
      )}
    </Modal>
  );
}

export default ModalFunctions;
