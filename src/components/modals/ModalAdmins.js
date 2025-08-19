import styles from "./ModalAdmins.module.css";
import SelectCheckbox from "../form/SelectCheckbox";
import { useTeam } from "../../context/TeamContext";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import { updateTeam } from "../../api/services/teamService";
import { toast } from "react-toastify";
function ModalAdmins({ isOpen, onClose }) {
  const { team, setTeam } = useTeam();
  const membros = team?.members || [];
  const [administradores, setAdministradores] = useState(team?.admins || []);
  const [disabled, setDisabled] = useState(true);


  useEffect(() => {
    const administradoresIds = administradores.map((admin) => admin.id);
    const equipeAdministradoresIds = (team?.admins || []).map(
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

  }, [administradores, team?.admins]);


  const updateAdministradores = async () => {
    try {
      const administradoresIds = administradores.map((admin) => admin.id);
      await updateTeam(team.id, { admins: administradoresIds });
      toast.success("Administradores atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar administradores:", error);
      toast.error("Erro ao atualizar administradores");
    } finally {
      setTeam({ ...team, admins: administradores });
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

export default ModalAdmins;
