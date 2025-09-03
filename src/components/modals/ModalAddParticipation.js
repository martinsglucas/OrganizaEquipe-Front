import styles from "./ModalAddParticipation.module.css";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import Select from "../form/Select";
import SelectCheckbox from "../form/SelectCheckbox";
import { toast } from "react-toastify";
import { getAvailableMembers } from "../../api/services/teamService";
import ModalLoading from "./ModalLoading";
import ModalConfirmation from "./ModalConfirmation";

function ModalAddParticipation({ title, schedule, participation, participations, setParticipations, onClose }) {

  const team = schedule.team;
  const [selectedMember, setSelectedMember] = useState(participation?.user.id || "");
  const [selectedRoles, setSelectedRoles] = useState(participation?.roles || []);
  const [availableMembers, setAvailableMembers] = useState([])
  const [assignedMembers, setAssignedMembers] = useState([])
  const [unavailableMembers, setUnvailableMembers] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [memberToSelect, setMemberToSelect] = useState(null);

  const fetchAvailableMembers = async () => {
    try {
      setIsLoading(true);
      const members = await getAvailableMembers(team.id, {date: schedule.date});
      setUnvailableMembers(members.unavailable_members.map((m) => ({id: m.id, name:`${m.first_name} (Indisponível)`})));
      const assigned = members.assigned_members.map((m) => ({id: m.id, first_name: `${m.first_name} (Escalado)`}))
      setAssignedMembers(assigned);
      setAvailableMembers(members.available_members.concat(assigned));
    } catch (error) {
      toast.error("Erro ao buscar membros disponíveis");
    } finally {
      setIsLoading(false);
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

  const handleSelect = (id) => {
    if (assignedMembers.some((m) => m.id === id)) {
      setShowConfirmation(true);
      setMemberToSelect(
        assignedMembers.find((m) => m.id === id)
      );
    } else {
      setSelectedMember(id);
    }

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
              handleSelect(parseInt(e.target.value))
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
          <button
            className={styles.button_submit}
            onClick={() => addParticipation()}
          >
            Adicionar
          </button>
        </div>
      </div>
      {isLoading && <ModalLoading isOpen={isLoading} />}
      {showConfirmation && (
        <ModalConfirmation
          title={"Membro já escalado"}
          message={`${memberToSelect.first_name.slice(0, -11)} já está relacionado em outra escala nessa mesma data. Deseja escalar mesmo assim?`}
          onClose={() => setShowConfirmation(false)}
          onConfirm={() => {setSelectedMember(memberToSelect.id); setShowConfirmation(false)}}
          noMarginTop={true}
        />
      )}
    </Modal>
  );
}

export default ModalAddParticipation;