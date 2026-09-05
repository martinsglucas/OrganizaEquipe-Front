import styles from "./ModalAdmins.module.css";
import SelectCheckbox from "../form/SelectCheckbox";
import { useTeam } from "../../context/TeamContext";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import { updateTeam } from "../../api/services/teamService";
import { toast } from "react-toastify";

function ModalAdmins({ isOpen, onClose }) {
  const { team, setTeam } = useTeam();
  const members = team?.members || [];
  const [admins, setAdmins] = useState(team?.admins || []);
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


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
      setErrorMessage("");
      setIsLoading(true);
      const adminsIds = admins.map((admin) => admin.id);
      await updateTeam(team.id, { admins: adminsIds });
      setTeam({ ...team, admins });
      toast.success("Administradores atualizados com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar administradores:", error);
      setErrorMessage(
        "Não foi possível atualizar os administradores. Tente novamente."
      );
      toast.error("Erro ao atualizar administradores");
    } finally {
      setIsLoading(false);
    }
  }

  const handleAdminsChange = (selectedIds) => {
    const newAdmins = members.filter((member) =>
      selectedIds.includes(member.id)
    );

    setAdmins(newAdmins);

  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={"Administradores"}
      isBusy={isLoading}
    >
      <div className={styles.container} aria-busy={isLoading}>
        {members.length > 0 ? (
          <fieldset className={styles.selection} disabled={isLoading}>
            <legend className={styles.legend}>Selecione os administradores</legend>
            <SelectCheckbox
              options={members}
              info={"first_name"}
              checked={admins}
              handleOnChange={(user) => handleAdminsChange(user)}
            />
          </fieldset>
        ) : (
          <p className={styles.empty}>Nenhum membro disponível.</p>
        )}
        {admins.length === 0 && members.length > 0 && (
          <p className={styles.validation} role="alert">
            A equipe deve ter ao menos um administrador.
          </p>
        )}
        {errorMessage && (
          <p className={styles.error} role="alert">
            {errorMessage}
          </p>
        )}
        <button
          type="button"
          disabled={disabled || isLoading}
          className={`${styles.buttonApply} ${
            disabled || isLoading ? styles.disabled : ""
          }`}
          onClick={() => updateAdmins()}
        >
          {isLoading ? "Salvando administradores..." : "Salvar administradores"}
        </button>
      </div>
    </Modal>
  );
}

export default ModalAdmins;
