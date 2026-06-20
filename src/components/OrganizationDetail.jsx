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

function OrganizationDetail() {
  const [showModalEditName, setShowModalEditName] = useState(false);
  const [showModalAdmins, setShowModalAdmins] =
    useState(false);
  const [showModalMembers, setShowModalMembers] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalRequests, setShowModalRequests] = useState(false);
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
              <b>{organization.name}</b>
            </div>
            {admin && (
              <IoIosArrowForward className={styles.openButton} />
            )}
          </button>
          <div className={styles.item}>
            <div className={styles.description}>
              <IoMdKey className={styles.itemTitle} />
              <b>Código:</b>&nbsp;{organization.code_access}
            </div>
          </div>
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
        <br></br>
        {admin && (
          <div className={styles.section}>
            <button
              className={styles.button}
              onClick={() => setShowModalDelete(true)}
            >
              <FaTrash />
              <span>Excluir Organização</span>
            </button>
          </div>
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
        />
      )}
    </div>
  );
}

export default OrganizationDetail;
