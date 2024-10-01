import styles from "./EquipeDetalhe.module.css";
import { useState } from "react";
import { useEquipe } from "../context/EquipeContext";
import { getTeam } from "../api/services/teamService";

function EquipeDetalhe({ equipe, equipes }) {
  const { setEquipe } = useEquipe();


  return (
    <div className={styles.container}>
      <div className={styles.nome}>
        <h1>{equipe.nome}</h1>
      </div>
      <div className={styles.info}>
        <p>Codigo de acesso: {equipe.codigo_de_acesso}</p>
        <h3>Administradores</h3>
        {equipe.administradores &&
          equipe.administradores.map((administrador) => (
            <span key={administrador.id}>{administrador.first_name}</span>
          ))}
        <h3>Membros</h3>
        {equipe.membros &&
          equipe.membros.map((membro) => (
            <span key={membro.id}>
              {membro.first_name}
              <br></br>
            </span>
          ))}
      </div>
    </div>
  );
}

export default EquipeDetalhe;
