import styles from "./Organization.module.css";
import { useState, useEffect } from "react";
import { getOrganizations } from "../api/services/organizationService";
import { useOrganization } from "../context/OrganizationContext";
import OrganizationDetail from "../components/OrganizationDetail";
import ModalCreateOrganization from "../components/modals/ModalCreateOrganization";
import { getUser } from "../api/services/userService";
import { useAuth } from "../context/AuthContext";

function Organization() {

  const { organization, setOrganization } = useOrganization();
  const { user, setUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [canCreateOrganization, setCanCreateOrganization] = useState(false);

  const getOrgs = async () => {
    try {
      const orgs = await getOrganizations(true);
      setOrganization(orgs[0]);
    } catch (error) {
      console.error("Erro ao buscar organizações:", error);
    }
  }

  useEffect(() => {
    getOrgs();
  }, []);

  useEffect(() => {
    setCanCreateOrganization(false);

    if (!user?.id) {
      return;
    }

    let active = true;

    const refreshCreationCapability = async () => {
      try {
        const refreshedUser = await getUser(user.id);
        if (!active) return;
        setUser(refreshedUser);
        localStorage.setItem("user", JSON.stringify(refreshedUser));
        setCanCreateOrganization(
          Boolean(refreshedUser.can_create_organization)
        );
      } catch (error) {
        if (!active) return;
        setCanCreateOrganization(false);
        console.error("Erro ao atualizar permissão de organização:", error);
      }
    };

    refreshCreationCapability();
    return () => {
      active = false;
    };
  }, [user?.id, setUser]);

  if (!organization) {
    return (
      <div className={`${styles.container} ${styles.center}`}>
        <h2 className={styles.warning}>
          Você ainda não faz parte de uma organização. <br></br>
          {canCreateOrganization
            ? "Crie ou ingresse em uma:"
            : "Ingresse em uma:"}
        </h2>
        <button className={styles.add} onClick={() => setShowModal(true)}>
          <span>+</span>
        </button>
        {showModal && (
          <ModalCreateOrganization
            closeModal={() => setShowModal(false)}
            canCreateOrganization={canCreateOrganization}
          />
        )}
      </div>
    );
  }
  if (organization.length === 0) {
    return <div>Nenhuma organização encontrada.</div>;
  }

  return (
    <div className={styles.container}>
      <OrganizationDetail />
    </div>
  );
}

export default Organization;
