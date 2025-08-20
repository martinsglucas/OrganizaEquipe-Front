import styles from "./ModalAddParticipation.module.css";
import Modal from "./Modal";
import { useState } from "react";
import Select from "../form/Select";
import SelectCheckbox from "../form/SelectCheckbox";

function ModalAddParticipation({ title, schedule, participation, participations, setParticipations, onClose }) {

  const team = schedule.team;
  const [selectedMember, setSelectedMember] = useState(participation?.user.id || "");
  const [selectedRoles, setSelectedRoles] = useState(participation?.roles || []);

  const filterMembers = () => {
    if (participation) {
      return team.members
        .map((m) => ({ id: m.id, name: m.first_name }))
        .sort((m1, m2) => m1.name.localeCompare(m2.name));
    } else {
      return team.members
        .map((m) => ({ id: m.id, name: m.first_name }))
        .filter((m) => !participations.find((p) => p.user.id === m.id))
        .sort((m1, m2) => m1.name.localeCompare(m2.name));
    }
  }

  const members = filterMembers();
  const roles = team.roles;

  const addParticipation = () => {
    if (participation) {
      const newParticipations = participations.filter((p) => p.user.id !== participation.user.id);
      setParticipations([
        ...newParticipations,
        {
          roles: selectedRoles,
          user: team.members.find((m) => m.id === parseInt(selectedMember)),
        },
      ]);
    } else {
      setParticipations([...participations, {roles: selectedRoles, user: team.members.find((m) => m.id === parseInt(selectedMember))}])
    }
    onClose();
  }

  const handleRoles = (rolesIds) => {
    const newRoles = roles.filter((role) =>
      rolesIds.includes(role.id)
    );
    setSelectedRoles(newRoles);
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={title} noMarginTop={true}>
      <div className={styles.scheduleDetails}>
        <div className={styles.item}>
          {/* <RiTeamFill className={styles.icon} /> */}
          <Select
            text="Membro"
            name="member"
            options={members}
            value={selectedMember}
            handleOnChange={(e) => {
              setSelectedMember(e.target.value);
            }}
          />
        </div>
        <div className={styles.item}>
          <SelectCheckbox
            text={"Funcões"}
            options={roles}
            info={"name"}
            checked={selectedRoles}
            handleOnChange={(roles) => {
              handleRoles(roles);
            }}
          />
        </div>
        <div className={styles.item}>
          <button className={styles.button_submit} onClick={() => addParticipation()}>Adicionar</button>
        </div>
      </div>
    </Modal>
  );
}

export default ModalAddParticipation;