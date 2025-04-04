import styles from "./EquipeDetalhe.module.css";
import { IoMdSwap } from "react-icons/io";
import { useState } from "react";
import ModalSwapTeam from "./modals/ModalSwapTeam";
import { useEquipe } from "../context/EquipeContext";
import { getTeam, deleteTeam, getTeams } from "../api/services/teamService";
import ModalAdministradores from "./modals/ModalAdministradores";
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

function EquipeDetalhe({ equipes, setEquipes }) {
  const [showModalEditName, setShowModalEditName] = useState(false);
  const [showModalSwap, setShowModalSwap] = useState(false);
  const [showModalAdministradores, setShowModalAdministradores] =
    useState(false);
  const [showModalMembros, setShowModalMembros] = useState(false);
  const [showModalFuncoes, setShowModalFuncoes] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalRequests, setShowModalRequests] = useState(false);
  const { equipe, setEquipe, administrador } = useEquipe();
  const membros = equipe.membros.map((membro) => ({
    id: membro.id,
    content: membro.first_name,
  }));
  const managers = equipe.administradores.map((admin) => ({
    id: admin.id,
    content: admin.first_name,
  }));
  const functions = equipe.funcoes.map((funcao) => ({
    id: funcao.id,
    content: funcao.nome,
  }));

  const getEquipes = async () => {
    try {
      const equipes = await getTeams(true);
      setEquipes(equipes);
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
    }
  };

  const handleSwapModal = () => {
    getEquipes();
    setShowModalSwap(true);
  };

  const handleSwapTeam = async (id) => {
    const equipe = await getTeam(id);
    setEquipe(equipe);
    setShowModalSwap(false);
  };

  const handleDeleteTeam = async () => {
    try {
      await deleteTeam(equipe.id);
      setEquipe(null);
      setEquipes(equipes.filter((e) => e.id !== equipe.id));
      setShowModalDelete(false);
      toast.success("Equipe excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir equipe");
      console.error(error);
    }
  };

  const handleEditName = () => {
    if (administrador) {
      setShowModalEditName(true);
    }
  }

  if (!equipe || Object.keys(equipe).length === 0) {
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
              <b>{equipe.nome}</b>
            </div>
            {administrador && (
              <IoIosArrowForward className={styles.openButton} />
            )}
          </button>
          <div className={styles.item}>
            <div className={styles.description}>
              <IoMdKey className={styles.itemTitle} />
              <b>Código:</b> {equipe.codigo_de_acesso}
            </div>
          </div>
          <Accordion
            title={"Administradores"}
            icon={<RiAdminFill />}
            content={managers}
            edit={administrador}
            onEdit={() => setShowModalAdministradores(true)}
          />
          <Accordion
            title={"Membros"}
            icon={<RiTeamFill />}
            content={membros}
            edit={administrador}
            onEdit={() => {
              setShowModalMembros(true);
            }}
          />
          <Accordion
            title={"Funções"}
            icon={<BsPersonFillGear />}
            content={functions}
            edit={administrador}
            onEdit={() => {
              setShowModalFuncoes(true);
            }}
          />
          {administrador && (
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
        {administrador && (
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
        <ModalAdministradores
          isOpen={showModalAdministradores}
          onClose={() => setShowModalAdministradores(false)}
        />
      )}
      {showModalMembros && (
        <ModalMembers
          onClose={() => setShowModalMembros(false)}
          members={equipe.membros}
        />
      )}
      {showModalFuncoes && (
        <ModalFunctions
          onClose={() => setShowModalFuncoes(false)}
          functions={equipe.funcoes}
        />
      )}
      {showModalRequests && (
        <ModalRequests onClose={() => setShowModalRequests(false)} />
      )}
      {showModalSwap && (
        <ModalSwapTeam
          closeModal={() => setShowModalSwap(false)}
          handleSwapTeam={(equipe) => {
            handleSwapTeam(equipe.id);
          }}
          equipes={equipes}
        />
      )}
      {showModalDelete && (
        <ModalConfirmation
          title={"Excluir equipe"}
          message={`Tem certeza que deseja remover a equipe ${equipe.nome}?`}
          onConfirm={() => handleDeleteTeam()}
          onClose={() => setShowModalDelete(false)}
        />
      )}
    </div>
  );
}

export default EquipeDetalhe;
