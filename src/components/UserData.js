import styles from "./UserData.module.css";
import EditUser from "./EditUser";
import {
  updateUser,
  deleteUser,
  logoutUser,
} from "../api/services/userService";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useState } from "react";
import ModalConfirmation from "./modals/ModalConfirmation";

function UserData({ edit, setEdit }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const putUser = async (user_id, first_name, email) => {
    try {
      await updateUser(user_id, { first_name, email });
      setEdit(false);
      toast.success("Informações atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  };

  const updatePassword = async (password) => {
    try {
      await updateUser(user.id, { password });
      setEdit(false);
      toast.success("Senha atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
    }
  };

  const deleteUserAccount = async () => {
    try {
      await deleteUser(user.id);
      setShowConfirmation(false);
      logoutUser();
      navigate("/login");
      toast.success("Conta deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
    }
  };

  return (
    <>
      {edit && (
        <div className={styles.container}>
          <EditUser
            user={user}
            handleUser={putUser}
            handlePassword={updatePassword}
            cancel={setEdit}
          />
          <button
            className={styles.btn}
            onClick={() => {
              setShowConfirmation(true);
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
      {showConfirmation && (
        <ModalConfirmation
          title={"Deletar conta"}
          message={"Tem certeza que deseja apagar sua conta?"}
          onClose={() => setShowConfirmation(false)}
          onConfirm={() => deleteUserAccount()}
        />
      )}
    </>
  );
}

export default UserData;
