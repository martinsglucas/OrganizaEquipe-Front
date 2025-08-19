import styles from "./Organization.module.css";
import { useState, useEffect } from "react";
import { getOrganizations } from "../api/services/organizationService";
import { useOrganization } from "../context/OrganizationContext";
import OrganizationDetail from "../components/OrganizationDetail";
import ModalCreateOrganization from "../components/modals/ModalCreateOrganization";

function Organization() {

  const { organization, setOrganization } = useOrganization();
  const [showModal, setShowModal] = useState(false);

  const getOrganizacoes = async () => {
    try {
      const organizacoes = await getOrganizations(true);
      setOrganization(organizacoes[0]);
    } catch (error) {
      console.error("Erro ao buscar organizações:", error);
    }
  }

  useEffect(() => {
    getOrganizacoes();
  }, []);

  if (!organization) {
    return (
      <div className={`${styles.container} ${styles.center}`}>
        <h2 className={styles.aviso}>
          Você ainda não faz parte de uma organização. <br></br> Crie ou
          ingresse em uma:
        </h2>
        <button className={styles.add} onClick={() => setShowModal(true)}>
          <span>+</span>
        </button>
        {showModal && (
          <ModalCreateOrganization
            closeModal={() => setShowModal(false)}
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
