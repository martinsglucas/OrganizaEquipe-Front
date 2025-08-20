import styles from "./Notifications.module.css"
import { deleteOrganizationInvitation, getOrganizationInvitations } from "../api/services/organizationInvitationService";
import { deleteTeamInvitation, getTeamInvitations } from "../api/services/teamInvitationService";
import { useEffect, useState, useCallback } from "react";
import { useOrganization } from "../context/OrganizationContext";
import { useTeam } from "../context/TeamContext";
import { useAuth } from "../context/AuthContext";
import { MdCancel, MdDone } from "react-icons/md";
import { addMember as addTeamMember } from "../api/services/teamService";
import { addMember as addOrgMember } from "../api/services/organizationService";
import { toast } from "react-toastify";

function Notifications() {

  const [orgInvitations, setOrgInvitations] = useState([]);
  const [teamInvitations, setTeamInvitations] = useState([]);
  const { organization } = useOrganization();
  const { team } = useTeam();
  const { user } = useAuth();

  const fetchInvitations = useCallback(async () => {
    if (!user?.email) return;

    try {
      const orgInvites = await getOrganizationInvitations(user.email);
      setOrgInvitations(orgInvites);

      const teamInvites = await getTeamInvitations(user.email);
      setTeamInvitations(teamInvites);
    } catch (error) {
      console.error("Erro ao buscar convites:", error);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations, organization, team]);

  const acceptTeamInvitation = async (invite) => {
    try {
      await addTeamMember(invite.team.id, {user_id: user.id});
      await deleteTeamInvitation(invite.id);
      const newInvitations = teamInvitations.filter((i) => i.id !== invite.id);
      setTeamInvitations(newInvitations);
      toast.success("Convite aceito!");
    } catch (error) {
      toast.error("Erro ao aceitar convite!");
    }
  };
  
  const refuseTeamInvitation = async (invite) => {
    try {
      await deleteTeamInvitation(invite.id);
      const newInvitations = teamInvitations.filter((i) => i.id !== invite.id);
      setTeamInvitations(newInvitations);
      toast.success("Convite recusado!");
    } catch (error) {
      toast.error("Erro ao recusar convite!");
    }
  };
  
  const acceptOrgInvitation = async (invite) => {
    try {
      await addOrgMember(invite.organization.id, {user_id: user.id});
      await deleteOrganizationInvitation(invite.id);
      const newInvitations = orgInvitations.filter((i) => i.id !== invite.id);
      setOrgInvitations(newInvitations);
      toast.success("Convite aceito!");
    } catch (error){
      toast.error("Erro ao aceitar convite!");
    }
  };
  
  const refuseOrgInvitation = async (invite) => {
    try {
      await deleteOrganizationInvitation(invite.id);
      const newInvitations = orgInvitations.filter((i) => i.id !== invite.id);
      setOrgInvitations(newInvitations);
      toast.success("Convite recusado!");
    } catch (error){
      toast.error("Erro ao recusar convite!");
    }
  };

  if (!orgInvitations.length && !teamInvitations.length) {
    return (
      <div className={`${styles.container} ${styles.center}`}>
        <h2 className={styles.aviso}>Você não tem notificações</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {orgInvitations.length > 0 && (
        <>
          {orgInvitations.map((invite) => (
            <div key={invite.id} className={styles.invitation}>
              <span className={styles.invitationMessage}>
                <span>Convite para ingressar na organização <b>{invite.organization.name}</b></span>
                <i>por {invite.sender_name}</i>
                {/* Convite de {invite.sender_name}: ingressar na organização {invite.organization} */}
              </span>
              <div className={styles.buttons}>
                <MdCancel
                  className={styles.cancel}
                  onClick={() => refuseOrgInvitation(invite)}
                />
                <MdDone
                  className={styles.approve}
                  onClick={() => acceptOrgInvitation(invite)}
                />
              </div>
            </div>
          ))}
        </>
      )}
      {teamInvitations.length > 0 && (
        <>
          {teamInvitations.map((invite) => (
            <div key={invite.id} className={styles.invitation}>
              <span className={styles.invitationMessage}>
                <span>Convite para ingressar na equipe <b>{invite.team.name}</b></span>
                <i>por {invite.sender_name}</i>
                {/* Convite de {invite.sender_name}: ingressar na equipe {invite.team} */}
              </span>
              <div className={styles.buttons}>
                <MdCancel
                  className={styles.cancel}
                  onClick={() => refuseTeamInvitation(invite)}
                />
                <MdDone
                  className={styles.approve}
                  onClick={() => acceptTeamInvitation(invite)}
                />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Notifications;