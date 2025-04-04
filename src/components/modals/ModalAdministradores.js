import styles from "./ModalAdministradores.module.css";
import SelectCheckbox from "../form/SelectCheckbox";
import { useEquipe } from "../../context/EquipeContext";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import { updateTeam } from "../../api/services/teamService";
import { toast } from "react-toastify";
function ModalAdministradores({ isOpen, onClose }) {
  const { equipe, setEquipe } = useEquipe();
  const membros = equipe?.membros || [];
  const [administradores, setAdministradores] = useState(equipe?.administradores || []);
  const [disabled, setDisabled] = useState(true);


  useEffect(() => {
    const administradoresIds = administradores.map((admin) => admin.id);
    const equipeAdministradoresIds = (equipe?.administradores || []).map(
      (admin) => admin.id
    );

    const idsSaoIguais =
      administradoresIds.length === equipeAdministradoresIds.length &&
      administradoresIds.every((id) => equipeAdministradoresIds.includes(id));

    setDisabled(idsSaoIguais);

    const withoutManager = administradoresIds.length === 0;
    if (withoutManager){
      setDisabled(withoutManager);
      toast.warn("A equipe deve ter ao menos um administrador!")
    }

  }, [administradores, equipe?.administradores]);


  const updateAdministradores = async () => {
    try {
      const administradoresIds = administradores.map((admin) => admin.id);
      await updateTeam(equipe.id, { administradores: administradoresIds });
      toast.success("Administradores atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar administradores:", error);
      toast.error("Erro ao atualizar administradores");
    } finally {
      setEquipe({ ...equipe, administradores: administradores });
      onClose();
    }
  }

  const handleAdministradoresChange = (selectedIds) => {
    const novosAdministradores = membros.filter((membro) =>
      selectedIds.includes(membro.id)
    );

    setAdministradores(novosAdministradores);

  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={"Administradores"}>
      <SelectCheckbox
        options={membros}
        info={"first_name"}
        checked={administradores}
        handleOnChange={(user) => handleAdministradoresChange(user)}
      />
      <button
        disabled={disabled}
        className={`${styles.buttonApply} ${
          disabled ? styles.disabled : ""
        }`}
        onClick={() => updateAdministradores()}
      >
        Aplicar
      </button>
    </Modal>
  );
}

export default ModalAdministradores;
