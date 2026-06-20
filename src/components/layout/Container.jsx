import styles from "./Container.module.css";
import { useOrganization } from "../../context/OrganizationContext";
import { getOrganizations } from "../../api/services/organizationService";
import { getTeams } from "../../api/services/teamService";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTeam } from "../../context/TeamContext";
import { toast } from "react-toastify";
import ModalLoading from "../modals/ModalLoading";

function Container(props) {

  const { setOrganization } = useOrganization();
  const { setTeams } = useTeam();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const fillProviders = async () => {
    try {
      setIsLoading(true);
      const organizations = await getOrganizations(true);
      setOrganization(organizations[0]);
      const teams = await getTeams(true);
      setTeams(teams);
    } catch (error) {
      console.error("Erro ao preencher providers:", error);
      toast.error("Erro ao buscar organização e equipes");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fillProviders();
    }
  }, [user, setOrganization, setTeams]);

  return (
    <div className={`${styles.container} ${styles[props.customClass]}`}>
      {props.children}
      {isLoading && (<ModalLoading isOpen={isLoading}/>)}
    </div>
  );
}

export default Container;
