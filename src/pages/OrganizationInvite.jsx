import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  acceptInvitationLink,
  resolveInvitationLink,
} from "../api/services/invitationLinkService";
import {
  getOrganization,
  getOrganizations,
} from "../api/services/organizationService";
import Loading from "../components/Loading";
import { useOrganization } from "../context/OrganizationContext";
import styles from "./OrganizationInvite.module.css";

function OrganizationInvite() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setOrganization } = useOrganization();
  const [invitation, setInvitation] = useState(null);
  const [status, setStatus] = useState("loading");
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    let active = true;

    const loadInvitation = async () => {
      try {
        const resolved = await resolveInvitationLink(token);
        if (resolved.target_type !== "organization") {
          if (active) setStatus("invalid");
          return;
        }

        let currentOrganization = null;
        try {
          const organizations = await getOrganizations(true);
          currentOrganization = organizations.find(
            (organization) => organization.id === resolved.target_id,
          );
        } catch {
          // Membership is confirmed safely by the idempotent acceptance endpoint.
        }

        if (!active) return;
        setInvitation(resolved);
        setIsMember(Boolean(currentOrganization));
        setStatus("ready");
      } catch (error) {
        if (!active) return;
        setStatus(error.response?.status === 404 ? "invalid" : "error");
      }
    };

    loadInvitation();
    return () => {
      active = false;
    };
  }, [token]);

  const handleAccept = async () => {
    try {
      setStatus("accepting");
      const accepted = await acceptInvitationLink(token);
      const organization = await getOrganization(accepted.target_id);
      setOrganization(organization);
      toast.success(
        isMember
          ? "Você já faz parte desta organização."
          : "Você entrou na organização com sucesso!",
      );
      navigate("/organizacao", { replace: true });
    } catch (error) {
      if (error.response?.status === 404) {
        setStatus("invalid");
      } else {
        setStatus("error");
      }
    }
  };

  if (status === "loading") {
    return (
      <main className={styles.container} aria-live="polite">
        <Loading />
        <p>Verificando convite...</p>
      </main>
    );
  }

  if (status === "invalid") {
    return (
      <main className={styles.container}>
        <section className={styles.card}>
          <h1>Convite indisponível</h1>
          <p>Este link é inválido, expirou ou foi revogado.</p>
          <button className={styles.secondaryButton} onClick={() => navigate("/")}>
            Ir para o início
          </button>
        </section>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className={styles.container}>
        <section className={styles.card}>
          <h1>Não foi possível abrir o convite</h1>
          <p>Verifique sua conexão e tente novamente.</p>
          <button
            className={styles.secondaryButton}
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <section className={styles.card} aria-labelledby="invite-title">
        <span className={styles.eyebrow}>Convite para organização</span>
        <h1 id="invite-title">{invitation.target_name}</h1>
        <p>
          {isMember
            ? "Você já faz parte desta organização. Confirme para acessá-la."
            : "Confirme para entrar diretamente como membro desta organização."}
        </p>
        <button
          className={styles.primaryButton}
          onClick={handleAccept}
          disabled={status === "accepting"}
        >
          {status === "accepting"
            ? "Confirmando..."
            : isMember
              ? "Acessar organização"
              : "Entrar na organização"}
        </button>
      </section>
    </main>
  );
}

export default OrganizationInvite;
