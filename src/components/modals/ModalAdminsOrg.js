import styles from "./ModalAdminsOrg.module.css";
import SelectCheckbox from "../form/SelectCheckbox";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import { updateOrganization } from "../../api/services/organizationService";
import { toast } from "react-toastify";
import { useOrganization } from "../../context/OrganizationContext";

function ModalAdminsOrg({ isOpen, onClose }) {
  const { organization, setOrganization } = useOrganization();
  const membros = organization?.members || [];
  const [administradores, setAdministradores] = useState(organization?.admins || []);
  const [disabled, setDisabled] = useState(true);


  useEffect(() => {
    const administradoresIds = administradores.map((admin) => admin.id);
    const orgAdministradoresIds = (organization?.admins || []).map(
      (admin) => admin.id
    );

    const idsSaoIguais =
      administradoresIds.length === orgAdministradoresIds.length &&
      administradoresIds.every((id) => orgAdministradoresIds.includes(id));

    setDisabled(idsSaoIguais);

    const withoutManager = administradoresIds.length === 0;
    if (withoutManager){
      setDisabled(withoutManager);
      toast.warn("A equipe deve ter ao menos um administrador!")
    }

  }, [administradores, organization?.admins]);


  const updateAdministradores = async () => {
    try {
      const administradoresIds = administradores.map((admin) => admin.id);
      await updateOrganization(organization.id, { admins: administradoresIds });
      toast.success("Administradores atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar administradores:", error);
      toast.error("Erro ao atualizar administradores");
    } finally {
      setOrganization((prev) => ({
        ...prev,
        admins: administradores,
      }));
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

export default ModalAdminsOrg;
