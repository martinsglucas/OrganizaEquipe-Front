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
  const [status, setStatus] = useState("loading");
  const [capabilityLoading, setCapabilityLoading] = useState(true);

  const getOrgs = async () => {
    try {
      setStatus("loading");
      const orgs = await getOrganizations(true);
      setOrganization(orgs[0] || null);
      setStatus("ready");
    } catch (error) {
      console.error("Erro ao buscar organizações:", error);
      setStatus("error");
    }
  };

  useEffect(() => {
    getOrgs();
  }, []);

  useEffect(() => {
    setCanCreateOrganization(false);
    setCapabilityLoading(true);

    if (!user?.id) {
      setCapabilityLoading(false);
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
      } finally {
        if (active) setCapabilityLoading(false);
      }
    };

    refreshCreationCapability();
    return () => {
      active = false;
    };
  }, [user?.id, setUser]);

  if (status === "loading") {
    return (
      <main className={`${styles.container} ${styles.center}`} aria-live="polite">
        <p className={styles.eyebrow}>Organizações</p>
        <h1>Carregando organização...</h1>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className={`${styles.container} ${styles.center}`}>
        <section className={styles.stateCard} role="alert">
          <p className={styles.eyebrow}>Organizações</p>
          <h1>Não foi possível carregar sua organização</h1>
          <p>Verifique sua conexão e tente novamente.</p>
          <button className={styles.primaryAction} onClick={getOrgs}>
            Tentar novamente
          </button>
        </section>
      </main>
    );
  }

  if (!organization) {
    return (
      <main className={`${styles.container} ${styles.center}`}>
        <section className={styles.stateCard}>
          <p className={styles.eyebrow}>Organizações</p>
          <h1>Você ainda não participa de uma organização</h1>
          <p>
            {capabilityLoading
              ? "Carregando as opções disponíveis..."
              : canCreateOrganization
                ? "Entre com um código de acesso ou crie uma nova organização."
                : "Use o código enviado por um administrador para solicitar acesso."}
          </p>
          <button
            className={styles.primaryAction}
            onClick={() => setShowModal(true)}
            disabled={capabilityLoading}
          >
            {canCreateOrganization
              ? "Criar ou ingressar em organização"
              : "Ingressar em organização"}
          </button>
        </section>
        {showModal && (
          <ModalCreateOrganization
            closeModal={() => setShowModal(false)}
            canCreateOrganization={canCreateOrganization}
          />
        )}
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <OrganizationDetail />
    </main>
  );
}

export default Organization;
