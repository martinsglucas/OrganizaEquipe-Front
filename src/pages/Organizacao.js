import styles from "./Organizacao.module.css";
import { useState, useEffect } from "react";
import { getOrganizations } from "../api/services/organizationService";

function Organizacao() {

  const [organizacoes, setOrganizacoes] = useState([]);

  const getOrganizacoes = async () => {
    try {
      const organizacoes = await getOrganizations(true);
      setOrganizacoes(organizacoes);
    } catch (error) {
      console.error("Erro ao buscar organizações:", error);
    }
  }

  useEffect(() => {
    getOrganizacoes();
  }, []);

  return (
    <div>
      <h1>Organização</h1>

      <div className={styles.organizacoes}>
        {organizacoes.map((organizacao) => (
          <div key={organizacao.id} className={styles.organizacao}>
            <h2>{organizacao.nome}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Organizacao;
