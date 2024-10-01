import styles from "./UserData.module.css";
import EditUser from "./EditUser";
import {
  updateUser,
  deleteUser,
  logoutUser,
} from "../api/services/userService";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

function UserData({ edit, setEdit, user, reload }) {
  const navigate = useNavigate();

  const putUser = async (user_id, first_name, email) => {
    try {
      await updateUser(user_id, { first_name, email });
      setEdit(false);
      reload();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  };

  const updatePassword = async (password) => {
    try {
      await updateUser(user.id, { password });
      setEdit(false);
      reload();
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
    }
  };

  const deleteUserAccount = async () => {
    try {
      await deleteUser(user.id);
      logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
    }
  };

  return (
    <>
      {edit && (
        <div className={styles.container}>
          {/* <div> */}
          <EditUser
            user={user}
            handleUser={putUser}
            handlePassword={updatePassword}
            cancel={setEdit}
          />
          <button
            className={styles.btn}
            onClick={() => {
              deleteUserAccount();
            }}
          >
            <FaTrash />
            <span>Deletar conta</span>
          </button>
        </div>
      )}
      {!edit && (
        <div className={styles.container}>
          <div>
            <div className={styles.data}>
              <span>Nome</span>
              <p>{user.first_name}</p>
            </div>
            <div className={styles.data}>
              <span>Email</span>
              <p>{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserData;
