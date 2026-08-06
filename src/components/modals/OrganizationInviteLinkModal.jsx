import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  getOrCreateOrganizationInvitationLink,
  regenerateInvitationLink,
  revokeInvitationLink,
} from "../../api/services/invitationLinkService";
import { useOrganization } from "../../context/OrganizationContext";
import Modal from "./Modal";
import styles from "./OrganizationInviteLinkModal.module.css";

function OrganizationInviteLinkModal({ onClose }) {
  const { organization } = useOrganization();
  const [link, setLink] = useState(null);
  const [status, setStatus] = useState("loading");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const inputRef = useRef(null);

  const invitationUrl = link
    ? `${window.location.origin}/convite/organizacao/${link.token}`
    : "";

  useEffect(() => {
    let active = true;

    const loadLink = async () => {
      try {
        const result = await getOrCreateOrganizationInvitationLink(
          organization.id,
        );
        if (!active) return;
        setLink(result);
        setStatus("ready");
      } catch {
        if (active) setStatus("error");
      }
    };

    loadLink();
    return () => {
      active = false;
    };
  }, [organization.id, loadAttempt]);

  const handleRetry = () => {
    setStatus("loading");
    setLoadAttempt((attempt) => attempt + 1);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      inputRef.current?.select();
      toast.success("Link copiado!");
    } catch {
      inputRef.current?.select();
      toast.error("Não foi possível copiar. Copie o link selecionado.");
    }
  };

  const handleRevoke = async () => {
    try {
      setStatus("saving");
      await revokeInvitationLink(link.id);
      setStatus("revoked");
      toast.success("Link revogado.");
    } catch {
      setStatus("ready");
      toast.error("Não foi possível revogar o link.");
    }
  };

  const handleRegenerate = async () => {
    try {
      setStatus("saving");
      const regenerated = await regenerateInvitationLink(link.id);
      setLink(regenerated);
      setStatus("ready");
      toast.success("Novo link gerado.");
    } catch {
      setStatus(link ? "ready" : "error");
      toast.error("Não foi possível gerar um novo link.");
    }
  };

  return (
    <Modal isOpen={true} title="Link de convite" onClose={onClose} noMarginTop>
      <div
        className={styles.content}
        role="dialog"
        aria-modal="true"
        aria-label="Gerenciar link de convite da organização"
        aria-live="polite"
      >
        <p>
          Compartilhe este link para adicionar pessoas diretamente à organização
          <strong> {organization.name}</strong>.
        </p>

        {status === "loading" && <p>Gerando link...</p>}
        {status === "error" && (
          <div className={styles.feedback} role="alert">
            <p>Não foi possível carregar o link.</p>
            <button onClick={handleRetry}>Tentar novamente</button>
          </div>
        )}
        {(status === "ready" || status === "saving") && (
          <>
            <label className={styles.label} htmlFor="organization-invite-url">
              URL do convite
            </label>
            <input
              ref={inputRef}
              id="organization-invite-url"
              className={styles.input}
              value={invitationUrl}
              readOnly
              autoFocus
            />
            <div className={styles.actions}>
              <button onClick={handleCopy} disabled={status === "saving"}>
                Copiar link
              </button>
              <button onClick={handleRegenerate} disabled={status === "saving"}>
                Regenerar
              </button>
              <button
                className={styles.dangerButton}
                onClick={handleRevoke}
                disabled={status === "saving"}
              >
                Revogar
              </button>
            </div>
          </>
        )}
        {status === "revoked" && (
          <div className={styles.feedback}>
            <p>O link foi revogado e não pode mais ser usado.</p>
            <button onClick={handleRegenerate}>Gerar novo link</button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default OrganizationInviteLinkModal;
