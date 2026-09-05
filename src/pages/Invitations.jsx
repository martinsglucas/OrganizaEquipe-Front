import styles from "./Invitations.module.css";
import {
  acceptOrganizationInvitation,
  rejectOrganizationInvitation,
} from "../api/services/organizationInvitationService";
import {
  acceptTeamInvitation as acceptTeamInvitationRequest,
  rejectTeamInvitation,
} from "../api/services/teamInvitationService";
import { getInvitations } from "../api/services/userService";
import { useCallback, useEffect, useRef, useState } from "react";
import { useOrganization } from "../context/OrganizationContext";
import { useTeam } from "../context/TeamContext";
import { useAuth } from "../context/AuthContext";
import { MdCancel, MdDone } from "react-icons/md";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

function Invitations() {
  const [orgInvitations, setOrgInvitations] = useState([]);
  const [teamInvitations, setTeamInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [pendingActions, setPendingActions] = useState({});
  const [actionErrors, setActionErrors] = useState({});
  const pendingKeys = useRef(new Set());
  const { organization } = useOrganization();
  const { team } = useTeam();
  const { user } = useAuth();

  const fetchInvitations = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    try {
      setIsLoading(true);
      setLoadError("");
      const invitations = await getInvitations(user.id);
      setOrgInvitations(invitations.org_invitations || []);
      setTeamInvitations(invitations.team_invitations || []);
    } catch (error) {
      setLoadError("Não foi possível carregar seus convites.");
      toast.error("Erro ao buscar convites!");
      console.error("Erro ao buscar convites:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations, organization?.id, team?.id]);

  const runInvitationAction = async ({ key, action, request, onSuccess, successMessage }) => {
    if (pendingKeys.current.has(key)) {
      return;
    }

    pendingKeys.current.add(key);
    setPendingActions((current) => ({ ...current, [key]: action }));
    setActionErrors((current) => ({ ...current, [key]: "" }));

    try {
      await request();
      onSuccess();
      toast.success(successMessage);
    } catch (error) {
      const actionLabel = action === "accept" ? "aceitar" : "recusar";
      setActionErrors((current) => ({
        ...current,
        [key]: `Não foi possível ${actionLabel} este convite. Tente novamente.`,
      }));
      toast.error(`Erro ao ${actionLabel} convite!`);
    } finally {
      pendingKeys.current.delete(key);
      setPendingActions((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
  };

  const acceptTeamInvitation = (invite) => {
    const key = `team-${invite.id}`;
    return runInvitationAction({
      key,
      action: "accept",
      request: () => acceptTeamInvitationRequest(invite.id),
      onSuccess: () =>
        setTeamInvitations((current) => current.filter((item) => item.id !== invite.id)),
      successMessage: "Convite aceito!",
    });
  };

  const refuseTeamInvitation = (invite) => {
    const key = `team-${invite.id}`;
    return runInvitationAction({
      key,
      action: "reject",
      request: () => rejectTeamInvitation(invite.id),
      onSuccess: () =>
        setTeamInvitations((current) => current.filter((item) => item.id !== invite.id)),
      successMessage: "Convite recusado!",
    });
  };

  const acceptOrgInvitation = (invite) => {
    const key = `organization-${invite.id}`;
    return runInvitationAction({
      key,
      action: "accept",
      request: () => acceptOrganizationInvitation(invite.id),
      onSuccess: () =>
        setOrgInvitations((current) => current.filter((item) => item.id !== invite.id)),
      successMessage: "Convite aceito!",
    });
  };

  const refuseOrgInvitation = (invite) => {
    const key = `organization-${invite.id}`;
    return runInvitationAction({
      key,
      action: "reject",
      request: () => rejectOrganizationInvitation(invite.id),
      onSuccess: () =>
        setOrgInvitations((current) => current.filter((item) => item.id !== invite.id)),
      successMessage: "Convite recusado!",
    });
  };

  const renderInvitation = (invite, type) => {
    const isOrganization = type === "organization";
    const key = `${type}-${invite.id}`;
    const pendingAction = pendingActions[key];
    const targetName = isOrganization ? invite.organization.name : invite.team.name;

    return (
      <article
        key={key}
        className={styles.invitation}
        aria-busy={Boolean(pendingAction)}
      >
        <div className={styles.invitationMessage}>
          <p>
            Convite para ingressar na {isOrganization ? "organização" : "equipe"}{" "}
            <strong>{targetName}</strong>
          </p>
          <span>Enviado por {invite.sender_name}</span>
        </div>
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.cancel}
            onClick={() =>
              isOrganization
                ? refuseOrgInvitation(invite)
                : refuseTeamInvitation(invite)
            }
            disabled={Boolean(pendingAction)}
          >
            <MdCancel aria-hidden="true" />
            <span>{pendingAction === "reject" ? "Recusando..." : "Recusar"}</span>
          </button>
          <button
            type="button"
            className={styles.approve}
            onClick={() =>
              isOrganization
                ? acceptOrgInvitation(invite)
                : acceptTeamInvitation(invite)
            }
            disabled={Boolean(pendingAction)}
          >
            <MdDone aria-hidden="true" />
            <span>{pendingAction === "accept" ? "Aceitando..." : "Aceitar"}</span>
          </button>
        </div>
        {actionErrors[key] && (
          <p className={styles.rowError} role="alert">
            {actionErrors[key]}
          </p>
        )}
      </article>
    );
  };

  const hasInvitations = orgInvitations.length > 0 || teamInvitations.length > 0;

  return (
    <main className={styles.container} aria-busy={isLoading}>
      <header className={styles.header}>
        <span>Central de acesso</span>
        <h1>Convites</h1>
        <p>Aceite ou recuse convites enviados para você.</p>
      </header>

      {isLoading ? (
        <section className={styles.status} aria-live="polite">
          <Loading />
          <p>Carregando convites...</p>
        </section>
      ) : loadError ? (
        <section className={styles.errorState} role="alert">
          <h2>Não foi possível exibir os convites</h2>
          <p>{loadError}</p>
          <button type="button" onClick={fetchInvitations}>
            Tentar novamente
          </button>
        </section>
      ) : !hasInvitations ? (
        <section className={styles.status}>
          <h2>Nenhum convite pendente</h2>
          <p>Quando alguém convidar você para uma organização ou equipe, o convite aparecerá aqui.</p>
        </section>
      ) : (
        <div className={styles.sections}>
          {orgInvitations.length > 0 && (
            <section className={styles.section} aria-labelledby="organization-invitations-title">
              <h2 id="organization-invitations-title">Organizações</h2>
              <div className={styles.list}>
                {orgInvitations.map((invite) => renderInvitation(invite, "organization"))}
              </div>
            </section>
          )}
          {teamInvitations.length > 0 && (
            <section className={styles.section} aria-labelledby="team-invitations-title">
              <h2 id="team-invitations-title">Equipes</h2>
              <div className={styles.list}>
                {teamInvitations.map((invite) => renderInvitation(invite, "team"))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}

export default Invitations;
