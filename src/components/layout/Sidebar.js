import styles from "./Sidebar.module.css";
import { FaTimes } from "react-icons/fa";
import { logoutUser } from "../../api/services/userService";
import { useAuth } from "../../context/AuthContext";
import { useOrganization } from "../../context/OrganizationContext";
import { useTeam } from "../../context/TeamContext";
import { MdPerson, MdPersonOff, MdNotifications, MdNotificationsActive, MdLogout } from "react-icons/md";

import SidebarItem from "./SidebarItem";
import { getTeamInvitations } from "../../api/services/teamInvitationService";
import { getOrganizationInvitations } from "../../api/services/organizationInvitationService";
import { useEffect, useState } from "react";

function Sidebar({ active }) { 
  
  const closeSidebar = () => active(false);
  
  const { setEquipe } = useTeam();
  const { setOrganization } = useOrganization();
  const [hasNotifications, setHasNotifications] = useState(false);
  
  const { user, setUser } = useAuth();

  const getNotifications = async () => {
    const teamNotifications = await getTeamInvitations(user.email);
    const orgNotifications = await getOrganizationInvitations(user.email);
    setHasNotifications(teamNotifications.length > 0 || orgNotifications.length > 0)
  };

  useEffect(() => {
    getNotifications();
  }, []);
  
  
  const logout = () => {
    logoutUser();
    setUser(null);
    setEquipe(null);
    setOrganization(null);
    closeSidebar();
  };

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <FaTimes className={styles.svg} onClick={closeSidebar} />
      <div className={styles.content}>
        <SidebarItem
          to={"/perfil"}
          Icon={MdPerson}
          Text={"Meu Perfil"}
          onClick={closeSidebar}
        />
        <SidebarItem
          to={"/indisponibilidade"}
          Icon={MdPersonOff}
          Text={"Indisponibilidade"}
          onClick={closeSidebar}
        />
        <SidebarItem
          to={"/notificacoes"}
          Icon={hasNotifications ? MdNotificationsActive : MdNotifications}
          Text={"Notificações"}
          onClick={closeSidebar}
          highlight={hasNotifications}
        />
        <SidebarItem
          to={"/login"}
          Icon={MdLogout}
          Text={"Sair"}
          onClick={logout}
        />
      </div>
    </div>
  );
}

export default Sidebar;
