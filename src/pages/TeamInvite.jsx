import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  acceptInvitationLink,
  resolveInvitationLink,
} from "../api/services/invitationLinkService";
import { getTeam } from "../api/services/teamService";
import Loading from "../components/Loading";
import { useTeam } from "../context/TeamContext";
import styles from "./OrganizationInvite.module.css";

function TeamInvite() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setTeam, teams, setTeams } = useTeam();
  const [invitation, setInvitation] = useState(null);
  const [status, setStatus] = useState("loading");
  const [prerequisiteMessage, setPrerequisiteMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadInvitation = async () => {
      try {
        const resolved = await resolveInvitationLink(token);
        if (!active) return;

        if (resolved.target_type !== "team") {
          setStatus("invalid");
          return;
        }

        setInvitation(resolved);
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
      const acceptedTeam = await getTeam(accepted.target_id);
      setTeam(acceptedTeam);
      setTeams((currentTeams) =>
        [...currentTeams.filter((team) => team.id !== acceptedTeam.id), acceptedTeam]
          .sort((first, second) => first.name.localeCompare(second.name))
      );
      toast.success(
        teams.some((team) => team.id === acceptedTeam.id)
          ? "Você já faz parte desta equipe."
          : "Você entrou na equipe com sucesso!"
      );
      navigate("/equipe", { replace: true });
    } catch (error) {
      if (error.response?.status === 403) {
        setPrerequisiteMessage(
          error.response?.data?.detail ||
            "Você precisa fazer parte da organização antes de entrar nesta equipe."
        );
        setStatus("prerequisite");
      } else if (error.response?.status === 404) {
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
          <p>Este link é inválido, expirou, foi revogado ou a equipe está fechada.</p>
          <button className={styles.secondaryButton} onClick={() => navigate("/")}>
            Ir para o início
          </button>
        </section>
      </main>
    );
  }

  if (status === "prerequisite") {
    return (
      <main className={styles.container}>
        <section className={styles.card} role="alert">
          <span className={styles.eyebrow}>Organização necessária</span>
          <h1>{invitation.target_name}</h1>
          <p>{prerequisiteMessage}</p>
          <button
            className={styles.secondaryButton}
            onClick={() => navigate("/organizacao")}
          >
            Ir para organizações
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

  const isMember = teams.some((team) => team.id === invitation.target_id);

  return (
    <main className={styles.container}>
      <section className={styles.card} aria-labelledby="invite-title">
        <span className={styles.eyebrow}>Convite para equipe</span>
        <h1 id="invite-title">{invitation.target_name}</h1>
        <p>
          {isMember
            ? "Você já faz parte desta equipe. Confirme para acessá-la."
            : "Confirme para entrar diretamente. É necessário fazer parte da organização desta equipe."}
        </p>
        <button
          className={styles.primaryButton}
          onClick={handleAccept}
          disabled={status === "accepting"}
        >
          {status === "accepting"
            ? "Confirmando..."
            : isMember
              ? "Acessar equipe"
              : "Entrar na equipe"}
        </button>
      </section>
    </main>
  );
}

export default TeamInvite;
