import styles from "./ModalAddParticipation.module.css";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import Select from "../form/Select";
import SelectCheckbox from "../form/SelectCheckbox";
import { toast } from "react-toastify";
import { getAvailableMembers } from "../../api/services/teamService";

function ModalAddParticipation({ title, schedule, participation, participations, setParticipations, onClose }) {

  const team = schedule.team;
  const [selectedMember, setSelectedMember] = useState(participation?.user.id || "");
  const [selectedRoles, setSelectedRoles] = useState(participation?.roles || []);
  const [availableMembers, setAvailableMembers] = useState([])
  const [unavailableMembers, setUnvailableMembers] = useState([])


  const fetchAvailableMembers = async () => {
    try {
      const members = await getAvailableMembers(team.id, {date: schedule.date});
      console.log(members.available_members);
      setAvailableMembers(members.available_members);
      setUnvailableMembers(members.unavailable_members.map((m) => ({id: m.id, name:`${m.first_name} (Indisponível)`})));
    } catch (error) {
      toast.error("Erro ao buscar membros disponíveis");
    }
  }

  useEffect(() => {
    fetchAvailableMembers();
  }, []);

  const filterMembers = () => {
    if (participation) {
      return team.members
        .map((m) => ({ id: m.id, name: m.first_name }))
        .sort((m1, m2) => m1.name.localeCompare(m2.name));
      } else {
        return availableMembers
          .map((m) => ({ id: m.id, name: m.first_name }))
          .filter((m) => !participations.find((p) => p.user.id === m.id))
          .sort((m1, m2) => m1.name.localeCompare(m2.name));
    }
  }

  const members = filterMembers();
  const roles = team.roles;

  const addParticipation = () => {
    if (!selectedMember) {
      toast.warn("Selecione um membro");
      return;
    }
    if (selectedRoles.length <= 0) {
      toast.warn("Selecione ao menos uma função");
      return;
    }
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
            disabledOptions={unavailableMembers}
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