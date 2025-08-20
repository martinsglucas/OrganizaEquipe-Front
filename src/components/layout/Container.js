import styles from "./Container.module.css";
import { useOrganization } from "../../context/OrganizationContext";
import { getOrganizations } from "../../api/services/organizationService";
import { getTeams } from "../../api/services/teamService";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTeam } from "../../context/TeamContext";

function Container(props) {

  const { setOrganization } = useOrganization();
  const { setTeams } = useTeam();
  const { user } = useAuth();
  
    const fillProviders = async () => {
      const organizations = await getOrganizations(true);
      setOrganization(organizations[0]);
      const teams = await getTeams(true);
      setTeams(teams);
    }

  useEffect(() => {
    if (user) {
      fillProviders();
    }
  }, [user, setOrganization, setTeams]);

  return (
    <div className={`${styles.container} ${styles[props.customClass]}`}>
      {props.children}
    </div>
  );
}

export default Container;
