import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/services/userService";
import { useState } from "react";
import UserData from "../components/UserData";
import styles from "./Profile.module.css";
import { useAuth } from "../context/AuthContext";
import { useTeam } from "../context/TeamContext";
import { useOrganization } from "../context/OrganizationContext";

function Profile() {
  const [edit, setEdit] = useState(false);
  const { setEquipe } = useTeam()
  const { setOrganization } = useOrganization();

  const { setUser } = useAuth();

  const navigate = useNavigate();

  const logout = () => {
    logoutUser();
    setUser(null);
    setEquipe(null);
    setOrganization(null);
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

export default Profile;
