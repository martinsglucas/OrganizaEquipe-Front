import { useNavigate } from "react-router-dom";
import { getUser, logoutUser } from "../api/services/userService";
import { useEffect, useState, useCallback } from "react";
import UserData from "../components/UserData";
import styles from "./Perfil.module.css";
import { FaPencilAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function Perfil() {
  const user_id = localStorage.getItem("userId");
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState(false);

  const navigate = useNavigate();

  const getDataUser = useCallback(async () => {
    try {
      const user = await getUser(user_id);
      setUser(user);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  }, [user_id]);

  useEffect(() => {
    getDataUser();
  }, [getDataUser]);

  const logout = () => {
    logoutUser();
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
        user={user}
        edit={edit}
        setEdit={setEdit}
        reload={getDataUser}
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
