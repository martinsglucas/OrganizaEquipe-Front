import styles from "./ModalRequests.module.css";
import Modal from "./Modal";
import { useState, useEffect } from "react";
import { useEquipe } from "../../context/EquipeContext";
import { deleteRequest, getRequests } from "../../api/services/requestService";
import { MdCancel, MdDone } from "react-icons/md";
import { toast } from "react-toastify";
import { addMember } from "../../api/services/teamService";

function ModalRequests({ onClose }) {
  const { equipe, setEquipe } = useEquipe();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (equipe?.codigo_de_acesso) {
        try {
          const response = await getRequests(equipe.codigo_de_acesso);
          setRequests(response);
        } catch (error) {
          console.error("Erro ao buscar solicitações:", error);
        }
      }
    };

    fetchRequests();
  }, [equipe]);

  const refuseRequest = async (id) => {
    try {
      await deleteRequest(id);
      const newRequests = requests.filter((request) => request.id !== id);
      setRequests(newRequests);
      toast.success("Solicitação recusada com sucesso");
    } catch (error) {
      toast.error("Erro ao recusar solicitação");
    }
  };

  const acceptRequest = async (request) => {
    try {
      await addMember(equipe.id, { user_id: request.usuario.id });
      setEquipe({ ...equipe, membros: [...equipe.membros, request.usuario] });
      await deleteRequest(request.id);
      const newRequests = requests.filter((r) => r.id !== request.id);
      setRequests(newRequests);
      toast.success("Solicitação aceita com sucesso");
    } catch (error) {
      toast.error("Erro ao aceitar solicitação");
    }
  };

  if (!requests || requests.length === 0)
    return (
      <Modal isOpen={true} onClose={onClose} title={"Solicitações"}>
        <p>Sem solicitações</p>
      </Modal>
    );

  return (
    <Modal isOpen={true} onClose={onClose} title={"Solicitações"}>
      {requests.map((request) => (
        <div key={request.id} className={styles.request}>
          <span>{request.usuario.first_name}</span>
          <div className={styles.buttons}>
            <MdCancel
              className={styles.cancel}
              onClick={() => refuseRequest(request.id)}
            />
            <MdDone
              className={styles.approve}
              onClick={() => acceptRequest(request)}
            />
          </div>
        </div>
      ))}
    </Modal>
  );
}

export default ModalRequests;
