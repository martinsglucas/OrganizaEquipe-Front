import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/services/userService";
import { useState } from "react";
import UserData from "../components/UserData";
import styles from "./Perfil.module.css";
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
      <UserData
        edit={edit}
        setEdit={setEdit}
      />
      {!edit && (
        <>
          <button className={styles.btnEdit} onClick={() => setEdit(!edit)}>
            Editar
          </button>

          <button
            className={styles.btnLogout}
            onClick={() => {
              logout();
            }}
          >
            Sair
          </button>
        </>
      )}
    </div>
  );
}

export default Perfil;
