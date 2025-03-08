import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/services/userService";
import { useState } from "react";
import UserData from "../components/UserData";
import styles from "./Perfil.module.css";
import { FaPencilAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";

function Perfil() {
  const [edit, setEdit] = useState(false);

  const { setUser } = useAuth();

  const navigate = useNavigate();

  const logout = () => {
    logoutUser();
    setUser(null);
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {!edit ? (
          <>
            <h1>Meu Perfil</h1>
            <FaPencilAlt
              className={styles.pencil}
              onClick={() => setEdit(!edit)}
            />
          </>
        ) : (
          <>
            <h1>Editar</h1>
            <IoClose className={styles.close} onClick={() => setEdit(!edit)} />
          </>
        )}
      </div>
      <UserData
        // user={user}
        edit={edit}
        setEdit={setEdit}
        // reload={getDataUser}
      />
      {!edit && (
        <button
          className={styles.btn}
          onClick={() => {
            logout();
          }}
        >
          Sair
        </button>
      )}
    </div>
  );
}

export default Perfil;
