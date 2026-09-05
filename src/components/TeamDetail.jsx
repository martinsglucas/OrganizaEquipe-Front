import styles from "./TeamDetail.module.css";
import { IoMdSwap } from "react-icons/io";
import { useState } from "react";
import ModalChangeTeam from "./modals/ModalChangeTeam";
import { useTeam } from "../context/TeamContext";
import {
  getTeam,
  deleteTeam,
  getTeams,
  updateTeam,
} from "../api/services/teamService";
import ModalAdmins from "./modals/ModalAdmins";
import Accordion from "./Accordion";
import { FaTrash } from "react-icons/fa";
import { BsPersonFillGear } from "react-icons/bs";
import { RiTeamFill } from "react-icons/ri";
import { RiAdminFill } from "react-icons/ri";
import { IoMdKey } from "react-icons/io";
import { MdTitle, MdEmail, MdVisibility } from "react-icons/md";
import ModalEditNameTeam from "./modals/ModalEditNameTeam";
import ModalMembers from "./modals/ModalMembers";
import ModalFunctions from "./modals/ModalFunctions";
import ModalConfirmation from "./modals/ModalConfirmation";
import ModalRequests from "./modals/ModalRequests";
import { toast } from "react-toastify";
import { IoIosArrowForward } from "react-icons/io";
import { FaLink } from "react-icons/fa6";
import TeamInviteLinkModal from "./modals/TeamInviteLinkModal";

const visibilityOptions = [
  {
    value: "discoverable",
    label: "Visível",
    description: "Membros da organização podem encontrar e solicitar ingresso.",
  },
  {
    value: "private",
    label: "Privada",
    description: "Oculta na busca; a entrada acontece somente por convite.",
  },
  {
    value: "closed",
    label: "Fechada",
    description: "Não aceita novos ingressos.",
  },
];

function TeamDetail() {
  const [showModalEditName, setShowModalEditName] = useState(false);
  const [showModalSwap, setShowModalSwap] = useState(false);
  const [showModalAdmins, setShowModalAdmins] =
    useState(false);
  const [showModalMembers, setShowModalMembers] = useState(false);
  const [showModalFunctions, setShowModalFunctions] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalRequests, setShowModalRequests] = useState(false);
  const [showInviteLink, setShowInviteLink] = useState(false);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const [pendingVisibility, setPendingVisibility] = useState(null);
  const { team, setTeam, admin, teams, setTeams } = useTeam();
  const members = team.members.map((member) => ({
    id: member.id,
    content: member.first_name,
  }));
  const admins = team.admins.map((admin) => ({
    id: admin.id,
    content: admin.first_name,
  }));
  const functions = team.roles.map((func) => ({
    id: func.id,
    content: func.name,
  }));

  const fetchTeams = async () => {
    try {
      const teams = await getTeams(true);
      setTeams(teams);
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
    }
  };

  const handleSwapModal = () => {
    fetchTeams();
    setShowModalSwap(true);
  };

  const handleChangeTeam = async (id) => {
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

  const updateVisibility = async (visibility) => {
    if (!admin || visibility === team.visibility) {
      return;
    }

    try {
      setIsUpdatingVisibility(true);
      await updateTeam(team.id, { visibility });
      setTeam((currentTeam) =>
        currentTeam ? { ...currentTeam, visibility } : currentTeam
      );
      setTeams((currentTeams) =>
        currentTeams.map((currentTeam) =>
          currentTeam.id === team.id
            ? { ...currentTeam, visibility }
            : currentTeam
        )
      );
      toast.success("Visibilidade alterada com sucesso!");
    } catch (error) {
      const message = error.response?.data?.detail;
      toast.error(message || "Erro ao alterar a visibilidade da equipe.");
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  const handleVisibilityChange = (event) => {
    const visibility = event.target.value;

    if (visibility === "closed" && team.visibility !== "closed") {
      setPendingVisibility(visibility);
      return;
    }

    updateVisibility(visibility);
  };

  if (!team || Object.keys(team).length === 0) {
    return <h3>Selecione uma equipe</h3>;
  }

  const visibility = team.visibility || "discoverable";
  const visibilityOption =
    visibilityOptions.find((option) => option.value === visibility) ||
    visibilityOptions[0];

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Equipe atual</span>
        <h1>{team.name}</h1>
        <p>
          {admin
            ? "Gerencie identidade, pessoas e formas de acesso."
            : "Consulte as informações, funções e pessoas desta equipe."}
        </p>
      </header>
      <div className={styles.info}>
        <section className={styles.group} aria-labelledby="team-info-title">
          <h2 id="team-info-title">Identidade</h2>
          <div className={styles.section}>
          {admin ? (
            <button onClick={handleEditName} className={styles.item}>
              <div className={styles.description}>
                <MdTitle className={styles.itemTitle} />
                <span><b>Nome</b><small>{team.name}</small></span>
              </div>
              <IoIosArrowForward className={styles.openButton} aria-hidden="true" />
            </button>
          ) : (
            <div className={styles.item}>
              <div className={styles.description}>
                <MdTitle className={styles.itemTitle} />
                <span><b>Nome</b><small>{team.name}</small></span>
              </div>
            </div>
          )}
          <div className={styles.item}>
            <div className={styles.description}>
              <IoMdKey className={styles.itemTitle} />
              <span><b>Código de acesso</b><small>{team.code_access}</small></span>
            </div>
          </div>
          <div className={`${styles.item} ${styles.visibilityItem}`}>
            <div className={styles.description}>
              <MdVisibility className={styles.itemTitle} />
              <div className={styles.visibilityDescription}>
                <b id="team-visibility-label">Visibilidade</b>
                <small id="team-visibility-description" aria-live="polite">
                  {isUpdatingVisibility
                    ? "Salvando visibilidade..."
                    : visibilityOption.description}
                </small>
              </div>
            </div>
            {admin ? (
              <select
                id="team-visibility"
                className={styles.visibilitySelect}
                value={visibility}
                onChange={handleVisibilityChange}
                disabled={isUpdatingVisibility}
                aria-labelledby="team-visibility-label"
                aria-describedby="team-visibility-description"
              >
                {visibilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <strong className={styles.visibilityValue}>
                {visibilityOption.label}
              </strong>
            )}
          </div>
          </div>
          {visibility === "closed" && (
            <p className={styles.closedNotice} role="status">
              Esta equipe não aceita novos ingressos. Administradores podem reabrir o
              acesso alterando a visibilidade.
            </p>
          )}
        </section>

        <section className={styles.group} aria-labelledby="team-people-title">
          <h2 id="team-people-title">Pessoas e acesso</h2>
          <div className={styles.section}>
          <Accordion
            title={"Administradores"}
            icon={<RiAdminFill />}
            content={admins}
            edit={admin}
            onEdit={() => setShowModalAdmins(true)}
          />
          <Accordion
            title={"Membros"}
            icon={<RiTeamFill />}
            content={members}
            edit={admin}
            onEdit={() => {
              setShowModalMembers(true);
            }}
          />
          <Accordion
            title={"Funções"}
            icon={<BsPersonFillGear />}
            content={functions}
            edit={admin}
            onEdit={() => {
              setShowModalFunctions(true);
            }}
          />
          {admin && (
            <button
              className={styles.item}
              onClick={() => setShowModalRequests(true)}
            >
              <div className={styles.description}>
                <MdEmail className={styles.itemTitle} />
                <b>Solicitações</b>
              </div>
              <IoIosArrowForward className={styles.openButton} aria-hidden="true" />
            </button>
          )}
          {admin && visibility !== "closed" && (
            <button
              className={styles.item}
              onClick={() => setShowInviteLink(true)}
            >
              <div className={styles.description}>
                <FaLink className={styles.itemTitle} />
                <b>Link de convite</b>
              </div>
              <IoIosArrowForward className={styles.openButton} aria-hidden="true" />
            </button>
          )}
          </div>
        </section>

        <button className={styles.secondaryAction} onClick={handleSwapModal}>
            <IoMdSwap />
            <span>Trocar Equipe</span>
        </button>
        {admin && (
          <section className={styles.dangerZone} aria-labelledby="team-danger-title">
            <div>
              <h2 id="team-danger-title">Zona de perigo</h2>
              <p>A exclusão remove o acesso de todos os membros.</p>
            </div>
            <button
              className={styles.dangerButton}
              onClick={() => setShowModalDelete(true)}
            >
              <FaTrash />
              <span>Excluir Equipe</span>
            </button>
          </section>
        )}
      </div>
      {showModalEditName && (
        <ModalEditNameTeam onClose={() => setShowModalEditName(false)} />
      )}
      {showModalAdmins && (
        <ModalAdmins
          isOpen={showModalAdmins}
          onClose={() => setShowModalAdmins(false)}
        />
      )}
      {showModalMembers && (
        <ModalMembers
          onClose={() => setShowModalMembers(false)}
          members={team.members}
        />
      )}
      {showModalFunctions && (
        <ModalFunctions
          onClose={() => setShowModalFunctions(false)}
          functions={team.roles}
        />
      )}
      {showModalRequests && (
        <ModalRequests onClose={() => setShowModalRequests(false)} />
      )}
      {showInviteLink && (
        <TeamInviteLinkModal onClose={() => setShowInviteLink(false)} />
      )}
      {showModalSwap && (
        <ModalChangeTeam
          closeModal={() => setShowModalSwap(false)}
          handleChangeTeam={(team) => {
            handleChangeTeam(team.id);
          }}
          teams={teams}
        />
      )}
      {showModalDelete && (
        <ModalConfirmation
          title={"Excluir equipe"}
          message={`Tem certeza que deseja remover a equipe ${team.name}?`}
          onConfirm={() => handleDeleteTeam()}
          onClose={() => setShowModalDelete(false)}
          confirmLabel="Excluir equipe"
          danger
        />
      )}
      {pendingVisibility && (
        <ModalConfirmation
          title={"Fechar equipe"}
          message={
            "Ao fechar a equipe, novos ingressos por descoberta, código ou link ficarão indisponíveis. Deseja continuar?"
          }
          onConfirm={async () => {
            await updateVisibility(pendingVisibility);
            setPendingVisibility(null);
          }}
          onClose={() => setPendingVisibility(null)}
          confirmLabel="Fechar equipe"
          danger
        />
      )}
    </div>
  );
}

export default TeamDetail;
