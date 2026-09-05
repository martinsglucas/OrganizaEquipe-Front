import styles from "./ModalRequestsOrg.module.css";
import Modal from "./Modal";
import { useCallback, useEffect, useRef, useState } from "react";
import { deleteRequest, getRequests } from "../../api/services/requestService";
import { MdCancel, MdDone } from "react-icons/md";
import { toast } from "react-toastify";
import { addMember } from "../../api/services/organizationService";
import { useOrganization } from "../../context/OrganizationContext";
import Loading from "../Loading";

function ModalRequestsOrg({ onClose }) {
  const { organization, setOrganization } = useOrganization();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [pendingActions, setPendingActions] = useState({});
  const [actionErrors, setActionErrors] = useState({});
  const pendingIds = useRef(new Set());
  const organizationId = organization?.id;
  const organizationCode = organization?.code_access;
  const hasPendingAction = Object.keys(pendingActions).length > 0;

  const fetchRequests = useCallback(async () => {
    if (!organizationCode) {
      setLoadError("Não foi possível identificar a organização.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setLoadError("");
      const response = await getRequests(organizationCode);
      setRequests(response || []);
    } catch (error) {
      setLoadError("Não foi possível carregar as solicitações desta organização.");
      console.error("Erro ao buscar solicitações:", error);
    } finally {
      setIsLoading(false);
    }
  }, [organizationCode]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const runRequestAction = async (request, action) => {
    if (pendingIds.current.has(request.id)) {
      return;
    }

    pendingIds.current.add(request.id);
    setPendingActions((current) => ({ ...current, [request.id]: action }));
    setActionErrors((current) => ({ ...current, [request.id]: "" }));

    try {
      if (action === "accept") {
        await addMember(organizationId, { user_id: request.user.id });
        setOrganization((currentOrganization) => {
          const updatedMembers = [...currentOrganization.members, request.user].sort(
            (a, b) => a.first_name.localeCompare(b.first_name)
          );
          return { ...currentOrganization, members: updatedMembers };
        });
        await deleteRequest(request.id);
        toast.success("Solicitação aceita com sucesso");
      } else {
        await deleteRequest(request.id);
        toast.success("Solicitação recusada com sucesso");
      }

      setRequests((current) => current.filter((item) => item.id !== request.id));
    } catch (error) {
      const actionLabel = action === "accept" ? "aceitar" : "recusar";
      setActionErrors((current) => ({
        ...current,
        [request.id]: `Não foi possível ${actionLabel} esta solicitação. Tente novamente.`,
      }));
      toast.error(`Erro ao ${actionLabel} solicitação`);
    } finally {
      pendingIds.current.delete(request.id);
      setPendingActions((current) => {
        const next = { ...current };
        delete next[request.id];
        return next;
      });
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Solicitações"
      isBusy={hasPendingAction}
    >
      <div className={styles.content} aria-busy={isLoading}>
        {isLoading ? (
          <div className={styles.status} aria-live="polite">
            <Loading />
            <p>Carregando solicitações...</p>
          </div>
        ) : loadError ? (
          <div className={styles.errorState} role="alert">
            <p>{loadError}</p>
            <button type="button" onClick={fetchRequests}>
              Tentar novamente
            </button>
          </div>
        ) : requests.length === 0 ? (
          <div className={styles.status}>
            <strong>Nenhuma solicitação pendente</strong>
            <p>Não há pedidos de entrada para esta organização.</p>
          </div>
        ) : (
          <div className={styles.list}>
            {requests.map((request) => {
              const pendingAction = pendingActions[request.id];

              return (
                <article
                  key={request.id}
                  className={styles.request}
                  aria-busy={Boolean(pendingAction)}
                >
                  <div className={styles.identity}>
                    <strong>{request.user.first_name}</strong>
                    <span>Solicitou entrada na organização</span>
                  </div>
                  <div className={styles.buttons}>
                    <button
                      type="button"
                      className={styles.cancel}
                      onClick={() => runRequestAction(request, "reject")}
                      disabled={Boolean(pendingAction)}
                    >
                      <MdCancel aria-hidden="true" />
                      <span>{pendingAction === "reject" ? "Recusando..." : "Recusar"}</span>
                    </button>
                    <button
                      type="button"
                      className={styles.approve}
                      onClick={() => runRequestAction(request, "accept")}
                      disabled={Boolean(pendingAction)}
                    >
                      <MdDone aria-hidden="true" />
                      <span>{pendingAction === "accept" ? "Aceitando..." : "Aceitar"}</span>
                    </button>
                  </div>
                  {actionErrors[request.id] && (
                    <p className={styles.rowError} role="alert">
                      {actionErrors[request.id]}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ModalRequestsOrg;
