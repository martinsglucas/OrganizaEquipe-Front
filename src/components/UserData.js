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

  const putUser = async (user_id, username, first_name, email, password) => {
    try {
      await updateUser(user_id, { username, first_name, email, password });
      // await updateUser(user_id, { username, first_name, email });
      setEdit(false);
      reload();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
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
          <EditUser user={user} handle={putUser} cancel={setEdit} />
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
              <span>Usuário</span>
              <p>{user.username}</p>
            </div>
            <div className={styles.data}>
              <span>Nome</span>
              <p>{user.first_name}</p>
            </div>
            <div className={styles.data}>
              <span>Email</span>
              <p>{user.email}</p>
            </div>
            <div className={styles.data}>
              <span>Funções</span>
              {/* <p>{user.funcoes}</p> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserData;
