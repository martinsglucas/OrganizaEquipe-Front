import styles from "./ModalCreateSchedule.module.css";
import Modal from "./Modal";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getTeam } from "../../api/services/teamService"
import { toast } from "react-toastify";
import Input from "../form/Input"
import Select from "../form/Select";
import { useTeam } from "../../context/TeamContext";
import ModalAddParticipation from "./ModalAddParticipation";
import ModalLoading from "./ModalLoading";
import { IoMdTrash } from "react-icons/io";
import { createSchedule, updateSchedule } from "../../api/services/scheduleService";

function ModalCreateSchedule({ title, schedule, onClose, onCreate, noMarginTop = false }) {
  const [viewMembers, setViewMembers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  const getBrazilDate = () => {
    const now = new Date();
    const brazilDate = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    return brazilDate.toISOString().split("T")[0];
  };

  const getBrazilHour = () => {
    const now = new Date();
    const brazilDate = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    return brazilDate.toTimeString().slice(0, 5);
  };

  const [titleInput, setTitleInput] = useState(schedule?.name || "");
  const [date, setDate] = useState(schedule?.date || getBrazilDate());
  const [hour, setHour] = useState(schedule?.hour || getBrazilHour());
  const { teams } = useTeam();
  const availableTeams = teams.filter(team => team.admins.includes(user.id));
  const [scheduleTeam, setScheduleTeam] = useState(schedule?.team || { id: "", name: "" });
  const [participations, setParticipations] = useState(schedule?.participations || []);
  const [participationToEdit, setParticipationToEdit] = useState(null)
  const [showModal, setShowModal] = useState(false);
  const [editMemberModal, setEditMemberModal] = useState(false);


  const searchTeam = async (idTeam) => {
    const team = await getTeam(idTeam);
    setScheduleTeam(team);
  }

  const removeParticipation = (participation) => {
    const newParticipations = participations.filter((p) => p.user.id !== participation.user.id)
    setParticipations(newParticipations);
    toast.success("Membro removido com sucesso!");
  }

  const addSchedule = async () => {
    if (!titleInput) {
      toast.warn("A escala precisa de um nome!")
      return;
    }
    try {
      setIsLoading(true);
      const mappedParticipations = participations.map((p) => ({
        roles: p.roles.map((r) => r.id),
        user: p.user.id
      }));

      const scheduleData = {
        participations: mappedParticipations,
        name: titleInput,
        date,
        hour,
        team: scheduleTeam.id
      };

      const newSchedule = await createSchedule(scheduleData);
      toast.success("Escala criada com sucesso!");
      onCreate(newSchedule);
      onClose();
    } catch (error) {
      toast.error("Erro ao criar escala.");
    } finally {
      setIsLoading(false);
    }
  }

  const editParticipation = (part) => {
    setEditMemberModal(true); 
    setParticipationToEdit(part);
  }

  const editSchedule = async () => {
    if (!titleInput) {
      toast.warn("A escala precisa de um nome!");
      return;
    }
    try {
      setIsLoading(true);
      const mappedParticipations = participations.map((p) => ({
        roles: p.roles.map((r) => r.id),
        user: p.user.id,
      }));

      const scheduleData = {
        participations: mappedParticipations,
        name: titleInput,
        date,
        hour,
        team: scheduleTeam.id,
      };

      await updateSchedule(schedule.id, scheduleData);

      schedule.participations = participations;
      schedule.name = titleInput;
      schedule.date = date;
      schedule.hour = hour;
      schedule.team = scheduleTeam;

      toast.success("Escala alterada com sucesso!");
      onClose();
    } catch (error) {
      toast.error("Erro ao alterar escala.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={title}
      noMarginTop={noMarginTop}
    >
      <div className={styles.scheduleDetails}>
        <div
          className={styles.change}
          onClick={() => setViewMembers(!viewMembers)}
        >
          <div
            className={`${
              !viewMembers ? styles.infoSelected : styles.infoNotSelected
            }`}
          >
            Informações
          </div>
          <div
            className={`${
              viewMembers ? styles.membersSelected : styles.membersNotSelected
            }`}
          >
            Participantes
          </div>
        </div>
        {!viewMembers && (
          <div className={styles.info}>
            <div className={styles.item}>
              <Input
                text="Nome"
                name="title"
                placeholder="Digite o nome da escala"
                type="text"
                value={titleInput}
                handleOnChange={(e) => {
                  setTitleInput(e.target.value);
                }}
              />
            </div>
            <div className={styles.item}>
              <Input
                text="Data"
                name="date"
                type="date"
                value={date}
                handleOnChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>
            <div className={styles.item}>
              <Input
                text="Hora"
                name="hour"
                type="time"
                value={hour}
                handleOnChange={(e) => {
                  setHour(e.target.value);
                }}
              />
            </div>
            <div className={styles.item}>
              <Select
                text="Equipe"
                name="team"
                options={availableTeams}
                value={scheduleTeam.id}
                handleOnChange={(e) => {
                  searchTeam(e.target.value);
                }}
              />
            </div>
          </div>
        )}
        {viewMembers && (
          <div className={styles.participations}>
            {participations.length > 0 ? (
              participations.map((participation, idx) => (
                <div
                  key={idx}
                  className={styles.participation}
                  onClick={() => {
                    if (schedule) editParticipation(participation);
                  }}
                >
                  <FaUserCircle className={styles.iconUser} />
                  <div className={styles.participationDetails}>
                    <p>{participation.user.first_name}</p>
                    <span>
                      {participation.roles.map((p) => p.name).join(", ")}
                    </span>
                  </div>
                  <IoMdTrash
                    className={styles.iconTrash}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeParticipation(participation);
                    }}
                  />
                </div>
              ))
            ) : (
              <div className={styles.noParticipations}>
                Nenhum participante adicionado.
              </div>
            )}
            {scheduleTeam.name &&
              !(participations.length === scheduleTeam.members.length) && (
                <button
                  className={styles.add}
                  onClick={() => setShowModal(true)}
                >
                  <span>+</span>
                </button>
              )}
          </div>
        )}
        {participations.length > 0 &&
          (schedule ? (
            <button
              className={styles.button_submit}
              onClick={() => editSchedule()}
            >
              Salvar
            </button>
          ) : (
            <button
              className={styles.button_submit}
              onClick={() => addSchedule()}
            >
              Criar
            </button>
          ))}
      </div>
      {showModal && (
        <ModalAddParticipation
          title="Nova Participação"
          schedule={{ team: scheduleTeam, date: date }}
          participations={participations}
          setParticipations={setParticipations}
          onClose={() => setShowModal(false)}
        />
      )}
      {editMemberModal && (
        <ModalAddParticipation
          title="Editar Participação"
          team={scheduleTeam}
          participation={participationToEdit}
          participations={participations}
          setParticipations={setParticipations}
          onClose={() => setEditMemberModal(false)}
        />
      )}
      {isLoading && <ModalLoading isOpen={isLoading} />}
    </Modal>
  );
}

export default ModalCreateSchedule;
