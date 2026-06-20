import styles from "./ModalRequestsOrg.module.css";
import Modal from "./Modal";
import { useState, useEffect } from "react";
import { deleteRequest, getRequests } from "../../api/services/requestService";
import { MdCancel, MdDone } from "react-icons/md";
import { toast } from "react-toastify";
import { addMember } from "../../api/services/organizationService";
import { useOrganization } from "../../context/OrganizationContext";
import Loading from "../Loading";

function ModalRequestsOrg({ onClose }) {
  const { organization, setOrganization } = useOrganization();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      if (organization?.code_access) {
        try {
          setIsLoading(true);
          const response = await getRequests(organization.code_access);
          setRequests(response);
        } catch (error) {
          console.error("Erro ao buscar solicitações:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRequests();
  }, [organization]);

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
      await addMember(organization.id, { user_id: request.user.id });
      const updatedMembers = [...organization.members, request.user].sort((a, b) =>
        a.first_name.localeCompare(b.first_name)
      );
      setOrganization({ ...organization, members: updatedMembers });
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

export default ModalRequestsOrg;
