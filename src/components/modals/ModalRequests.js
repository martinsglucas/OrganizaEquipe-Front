import styles from "./ModalRequests.module.css";
import Modal from "./Modal";
import { useState, useEffect } from "react";
import { useTeam } from "../../context/TeamContext";
import { deleteRequest, getRequests } from "../../api/services/requestService";
import { MdCancel, MdDone } from "react-icons/md";
import { toast } from "react-toastify";
import { addMember } from "../../api/services/teamService";
import Loading from "../Loading";

function ModalRequests({ onClose }) {
  const { team, setTeam } = useTeam();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      if (team?.code_access) {
        try {
          setIsLoading(true);
          const response = await getRequests(team.code_access);
          setRequests(response);
        } catch (error) {
          console.error("Erro ao buscar solicitações:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRequests();
  }, [team]);

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
      await addMember(team.id, { user_id: request.user.id });
      setTeam({ ...team, members: [...team.members, request.user] });
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
      {isLoading && <Loading/>}
      {requests.map((request) => (
        <div key={request.id} className={styles.request}>
          <span>{request.user.first_name}</span>
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
