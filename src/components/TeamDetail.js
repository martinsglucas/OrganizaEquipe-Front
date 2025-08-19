import styles from "./TeamDetail.module.css";
import { IoMdSwap } from "react-icons/io";
import { useState } from "react";
import ModalSwapTeam from "./modals/ModalSwapTeam";
import { useTeam } from "../context/TeamContext";
import { getTeam, deleteTeam, getTeams } from "../api/services/teamService";
import ModalAdmins from "./modals/ModalAdmins";
import Accordion from "./Accordion";
import { FaTrash } from "react-icons/fa";
import { BsPersonFillGear } from "react-icons/bs";
import { RiTeamFill } from "react-icons/ri";
import { RiAdminFill } from "react-icons/ri";
import { IoMdKey } from "react-icons/io";
import { MdTitle, MdEmail } from "react-icons/md";
import ModalEditNameTeam from "./modals/ModalEditNameTeam";
import ModalMembers from "./modals/ModalMembers";
import ModalFunctions from "./modals/ModalFunctions";
import ModalConfirmation from "./modals/ModalConfirmation";
import ModalRequests from "./modals/ModalRequests";
import { toast } from "react-toastify";
import { IoIosArrowForward } from "react-icons/io";

function TeamDetail() {
  const [showModalEditName, setShowModalEditName] = useState(false);
  const [showModalSwap, setShowModalSwap] = useState(false);
  const [showModalAdministradores, setShowModalAdministradores] =
    useState(false);
  const [showModalMembros, setShowModalMembros] = useState(false);
  const [showModalFuncoes, setShowModalFuncoes] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalRequests, setShowModalRequests] = useState(false);
  const { team, setTeam, admin, teams, setTeams } = useTeam();
  const membros = team.members.map((membro) => ({
    id: membro.id,
    content: membro.first_name,
  }));
  const managers = team.admins.map((admin) => ({
    id: admin.id,
    content: admin.first_name,
  }));
  const functions = team.roles.map((funcao) => ({
    id: funcao.id,
    content: funcao.name,
  }));

  const getEquipes = async () => {
    try {
      const equipes = await getTeams(true);
      setTeams(equipes);
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
    }
  };

  const handleSwapModal = () => {
    getEquipes();
    setShowModalSwap(true);
  };

  const handleSwapTeam = async (id) => {
    const team = await getTeam(id);
    setTeam(team);
    setShowModalSwap(false);
  };

  const handleDeleteTeam = async () => {
    try {
      await deleteTeam(team.id);
      setTeam(null);
      setTeams(teams.filter((e) => e.id !== team.id));
      setShowModalDelete(false);
      toast.success("Equipe excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir equipe");
      console.error(error);
    }
  };

  const handleEditName = () => {
    if (admin) {
      setShowModalEditName(true);
    }
  }

  if (!team || Object.keys(team).length === 0) {
    return <h3>Selecione uma equipe</h3>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.section}>
          <button
            onClick={handleEditName}
            className={styles.item}
            style={{ cursor: "pointer" }}
          >
            <div className={styles.description}>
              <MdTitle className={styles.itemTitle} />
              <b>{team.name}</b>
            </div>
            {admin && (
              <IoIosArrowForward className={styles.openButton} />
            )}
          </button>
          <div className={styles.item}>
            <div className={styles.description}>
              <IoMdKey className={styles.itemTitle} />
              <b>Código:</b>&nbsp;{team.code_access}
            </div>
          </div>
          <Accordion
            title={"Administradores"}
            icon={<RiAdminFill />}
            content={managers}
            edit={admin}
            onEdit={() => setShowModalAdministradores(true)}
          />
          <Accordion
            title={"Membros"}
            icon={<RiTeamFill />}
            content={membros}
            edit={admin}
            onEdit={() => {
              setShowModalMembros(true);
            }}
          />
          <Accordion
            title={"Funções"}
            icon={<BsPersonFillGear />}
            content={functions}
            edit={admin}
            onEdit={() => {
              setShowModalFuncoes(true);
            }}
          />
          {admin && (
            <button
              className={styles.item}
              onClick={() => setShowModalRequests(true)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.description}>
                <MdEmail className={styles.itemTitle} />
                <b>Solicitações</b>
              </div>
              <IoIosArrowForward className={styles.openButton} />
            </button>
          )}
        </div>
        <br></br>
        <div className={styles.section}>
          <button className={styles.button} onClick={handleSwapModal}>
            <IoMdSwap />
            <span>Trocar Equipe</span>
          </button>
        </div>
        <br></br>
        {admin && (
          <div className={styles.section}>
            <button
              className={styles.button}
              onClick={() => setShowModalDelete(true)}
            >
              <FaTrash />
              <span>Excluir Equipe</span>
            </button>
          </div>
        )}
      </div>
      {showModalEditName && (
        <ModalEditNameTeam onClose={() => setShowModalEditName(false)} />
      )}
      {showModalAdministradores && (
        <ModalAdmins
          isOpen={showModalAdministradores}
          onClose={() => setShowModalAdministradores(false)}
        />
      )}
      {showModalMembros && (
        <ModalMembers
          onClose={() => setShowModalMembros(false)}
          members={team.members}
        />
      )}
      {showModalFuncoes && (
        <ModalFunctions
          onClose={() => setShowModalFuncoes(false)}
          functions={team.roles}
        />
      )}
      {showModalRequests && (
        <ModalRequests onClose={() => setShowModalRequests(false)} />
      )}
      {showModalSwap && (
        <ModalSwapTeam
          closeModal={() => setShowModalSwap(false)}
          handleSwapTeam={(team) => {
            handleSwapTeam(team.id);
          }}
          equipes={teams}
        />
      )}
      {showModalDelete && (
        <ModalConfirmation
          title={"Excluir equipe"}
          message={`Tem certeza que deseja remover a equipe ${team.name}?`}
          onConfirm={() => handleDeleteTeam()}
          onClose={() => setShowModalDelete(false)}
        />
      )}
    </div>
  );
}

export default TeamDetail;
