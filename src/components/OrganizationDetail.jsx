import styles from "./OrganizationDetail.module.css";
import { useState } from "react";
import { useTeam } from "../context/TeamContext";
import { useOrganization } from "../context/OrganizationContext";
import { deleteOrganization } from "../api/services/organizationService";
// import { getTeam, deleteTeam, getTeams } from "../api/services/teamService";
import ModalAdminsOrg from "./modals/ModalAdminsOrg";
import Accordion from "./Accordion";
import { FaTrash } from "react-icons/fa";
// import { BsPersonFillGear } from "react-icons/bs";
import { RiTeamFill } from "react-icons/ri";
import { RiAdminFill } from "react-icons/ri";
import { IoMdKey } from "react-icons/io";
import { MdTitle, MdEmail } from "react-icons/md";
import ModalEditNameOrganization from "./modals/ModalEditNameOrganization";
import ModalMembersOrg from "./modals/ModalMembersOrg";
import ModalConfirmation from "./modals/ModalConfirmation";
import ModalRequestsOrg from "./modals/ModalRequestsOrg";
import { toast } from "react-toastify";
import { IoIosArrowForward } from "react-icons/io";
import { FaLink } from "react-icons/fa6";
import OrganizationInviteLinkModal from "./modals/OrganizationInviteLinkModal";

function OrganizationDetail() {
  const [showModalEditName, setShowModalEditName] = useState(false);
  const [showModalAdmins, setShowModalAdmins] =
    useState(false);
  const [showModalMembers, setShowModalMembers] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalRequests, setShowModalRequests] = useState(false);
  const [showInviteLink, setShowInviteLink] = useState(false);
  const { setTeam } = useTeam();
  const { organization, setOrganization, admin } = useOrganization();
  const members = organization.members.map((member) => ({
    id: member.id,
    content: member.first_name,
  }));
  const admins = organization.admins.map((admin) => ({
    id: admin.id,
    content: admin.first_name,
  }));


  // const getEquipes = async () => {
  //   try {
  //     const equipes = await getTeams(true);
  //     setEquipes(equipes);
  //   } catch (error) {
  //     console.error("Erro ao buscar equipes:", error);
  //   }
  // };

  const handleDeleteOrganization = async () => {
    try {
      await deleteOrganization(organization.id);
      setOrganization(null);
      setTeam(null);
      setShowModalDelete(false);
      toast.success("Organização excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir organização");
      console.error(error);
    }
  };

  const handleEditName = () => {
    if (admin) {
      setShowModalEditName(true);
    }
  };

  if (!organization || Object.keys(organization).length === 0) {
    return <h3>Selecione uma organização</h3>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Organização atual</span>
        <h1>{organization.name}</h1>
        <p>
          {admin
            ? "Gerencie identidade, pessoas e formas de acesso."
            : "Consulte as informações e pessoas desta organização."}
        </p>
      </header>
      <div className={styles.info}>
        <section className={styles.group} aria-labelledby="organization-info-title">
          <h2 id="organization-info-title">Identidade</h2>
          <div className={styles.section}>
          {admin ? (
            <button onClick={handleEditName} className={styles.item}>
              <div className={styles.description}>
                <MdTitle className={styles.itemTitle} />
                <span><b>Nome</b><small>{organization.name}</small></span>
              </div>
              <IoIosArrowForward className={styles.openButton} aria-hidden="true" />
            </button>
          ) : (
            <div className={styles.item}>
              <div className={styles.description}>
                <MdTitle className={styles.itemTitle} />
                <span><b>Nome</b><small>{organization.name}</small></span>
              </div>
            </div>
          )}
          <div className={styles.item}>
            <div className={styles.description}>
              <IoMdKey className={styles.itemTitle} />
              <span><b>Código de acesso</b><small>{organization.code_access}</small></span>
            </div>
          </div>
          </div>
        </section>

        <section className={styles.group} aria-labelledby="organization-people-title">
          <h2 id="organization-people-title">Pessoas e acesso</h2>
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
          {admin && (
            <>
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
            </>
          )}
          </div>
        </section>
        {admin && (
          <section className={styles.dangerZone} aria-labelledby="organization-danger-title">
            <div>
              <h2 id="organization-danger-title">Zona de perigo</h2>
              <p>A exclusão remove o acesso de todos os membros.</p>
            </div>
            <button
              className={styles.dangerButton}
              onClick={() => setShowModalDelete(true)}
            >
              <FaTrash />
              <span>Excluir Organização</span>
            </button>
          </section>
        )}
      </div>
      {showModalEditName && (
        <ModalEditNameOrganization onClose={() => setShowModalEditName(false)} />
      )}
      {showModalAdmins && (
        <ModalAdminsOrg
          isOpen={showModalAdmins}
          onClose={() => setShowModalAdmins(false)}
        />
      )}
      {showModalMembers && (
        <ModalMembersOrg
          onClose={() => setShowModalMembers(false)}
          members={organization.members}
        />
      )}
      {showModalRequests && (
        <ModalRequestsOrg onClose={() => setShowModalRequests(false)} />
      )}
      {showModalDelete && (
        <ModalConfirmation
          title={"Excluir organização"}
          message={`Tem certeza que deseja remover a organização ${organization.name}?`}
          onConfirm={() => handleDeleteOrganization()}
          onClose={() => setShowModalDelete(false)}
          confirmLabel="Excluir organização"
          danger
        />
      )}
      {showInviteLink && (
        <OrganizationInviteLinkModal onClose={() => setShowInviteLink(false)} />
      )}
    </div>
  );
}

export default OrganizationDetail;
