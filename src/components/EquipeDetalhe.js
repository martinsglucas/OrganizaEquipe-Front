import styles from "./EquipeDetalhe.module.css";
import { IoMdSwap } from "react-icons/io";
import { useState } from "react";
import ModalSwapTeam from "./ModalSwapTeam";
import { useEquipe } from "../context/EquipeContext";
import { getTeam } from "../api/services/teamService";

function EquipeDetalhe({ equipe, equipes }) {
  const [showModalSwap, setShowModalSwap] = useState(false);
  const { setEquipe } = useEquipe();

  const handleSwapModal = () => {
    setShowModalSwap(!showModalSwap);
  };

  const handleSwapTeam = async (id) => {
    const equipe = await getTeam(id);
    setEquipe(equipe);
    setShowModalSwap(false);
  };

  if (!equipe || Object.keys(equipe).length === 0) {
    return <h3>Selecione uma equipe</h3>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.nome}>
        <h1>{equipe.nome}</h1>
        <IoMdSwap className={styles.icon} onClick={handleSwapModal} />
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
      {showModalSwap && (
        <ModalSwapTeam
          closeModal={handleSwapModal}
          handleSwapTeam={(equipe) => {
            handleSwapTeam(equipe.id);
          }}
          equipes={equipes}
        />
      )}
    </div>
  );
}

export default EquipeDetalhe;
