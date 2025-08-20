import styles from "./ModalAdminsOrg.module.css";
import SelectCheckbox from "../form/SelectCheckbox";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import { updateOrganization } from "../../api/services/organizationService";
import { toast } from "react-toastify";
import { useOrganization } from "../../context/OrganizationContext";

function ModalAdminsOrg({ isOpen, onClose }) {
  const { organization, setOrganization } = useOrganization();
  const members = organization?.members || [];
  const [admins, setAdmins] = useState(organization?.admins || []);
  const [disabled, setDisabled] = useState(true);


  useEffect(() => {
    const adminsIds = admins.map((admin) => admin.id);
    const orgAdminsIds = (organization?.admins || []).map(
      (admin) => admin.id
    );

    const equalIds =
      adminsIds.length === orgAdminsIds.length &&
      adminsIds.every((id) => orgAdminsIds.includes(id));

    setDisabled(equalIds);

    const withoutAdmin = adminsIds.length === 0;
    if (withoutAdmin){
      setDisabled(withoutAdmin);
      toast.warn("A organização deve ter ao menos um administrador!")
    }

  }, [admins, organization?.admins]);


  const updateAdmins = async () => {
    try {
      const adminsIds = admins.map((admin) => admin.id);
      await updateOrganization(organization.id, { admins: adminsIds });
      toast.success("Administradores atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar administradores:", error);
      toast.error("Erro ao atualizar administradores");
    } finally {
      setOrganization((prev) => ({
        ...prev,
        admins: admins,
      }));
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
      <SelectCheckbox
        options={members}
        info={"first_name"}
        checked={admins}
        handleOnChange={(user) => handleAdminsChange(user)}
      />
      <button
        disabled={disabled}
        className={`${styles.buttonApply} ${
          disabled ? styles.disabled : ""
        }`}
        onClick={() => updateAdmins()}
      >
        Aplicar
      </button>
    </Modal>
  );
}

export default ModalAdminsOrg;
