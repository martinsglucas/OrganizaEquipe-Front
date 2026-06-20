import styles from "./ModalAdmins.module.css";
import SelectCheckbox from "../form/SelectCheckbox";
import { useTeam } from "../../context/TeamContext";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import ModalLoading from "./ModalLoading";
import { updateTeam } from "../../api/services/teamService";
import { toast } from "react-toastify";

function ModalAdmins({ isOpen, onClose }) {
  const { team, setTeam } = useTeam();
  const members = team?.members || [];
  const [admins, setAdmins] = useState(team?.admins || []);
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const adminsIds = admins.map((admin) => admin.id);
    const teamAdminsIds = (team?.admins || []).map(
      (admin) => admin.id
    );

    const equalIds =
      adminsIds.length === teamAdminsIds.length &&
      adminsIds.every((id) => teamAdminsIds.includes(id));

    setDisabled(equalIds);

    const withoutAdmin = adminsIds.length === 0;
    if (withoutAdmin){
      setDisabled(withoutAdmin);
      toast.warn("A equipe deve ter ao menos um administrador!")
    }

  }, [admins, team?.admins]);


  const updateAdmins = async () => {
    try {
      setIsLoading(true);
      const adminsIds = admins.map((admin) => admin.id);
      await updateTeam(team.id, { admins: adminsIds });
      toast.success("Administradores atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar administradores:", error);
      toast.error("Erro ao atualizar administradores");
    } finally {
      setTeam({ ...team, admins: admins });
      setIsLoading(false);
      onClose();
    }
  }

  const handleAdminsChange = (selectedIds) => {
    const newAdmins = members.filter((member) =>
      selectedIds.includes(member.id)
    );

    setAdmins(newAdmins);

  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={"Administradores"}>
      <div className={styles.container}>
        <SelectCheckbox
          options={members}
          info={"first_name"}
          checked={admins}
          handleOnChange={(user) => handleAdminsChange(user)}
        />
        <button
          disabled={disabled}
          className={`${styles.buttonApply} ${disabled ? styles.disabled : ""}`}
          onClick={() => updateAdmins()}
        >
          Aplicar
        </button>
        {isLoading && <ModalLoading isOpen={isLoading} />}
      </div>
    </Modal>
  );
}

export default ModalAdmins;
