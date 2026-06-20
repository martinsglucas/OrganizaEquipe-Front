import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UserData from "../components/UserData";
import styles from "./Profile.module.css";
import { useAuth } from "../context/AuthContext";
import { useTeam } from "../context/TeamContext";
import { useOrganization } from "../context/OrganizationContext";
import { useNotifications } from "../context/NotificationContext";
import { logoutUser } from "../api/services/userService";
import NotificationStatus from "../components/notifications/NotificationStatus";
import IosInstallHint from "../components/notifications/IosInstallHint";

function Profile() {
  const [edit, setEdit] = useState(false);
  const { setTeam } = useTeam();
  const { setOrganization } = useOrganization();
  const { setUser } = useAuth();
  const {
    status,
    isLoading: notificationsLoading,
    enableNotifications,
    refreshNotificationStatus,
    error: notificationsError,
  } = useNotifications();

  const navigate = useNavigate();

  const logout = () => {
    logoutUser();
    setUser(null);
    setTeam(null);
    setOrganization(null);
    navigate("/login");
  };

  const getNotificationUi = () => {
    switch (status) {
      case "enabled":
        return {
          title: "Notificações ativadas",
          statusLabel: "Ativas",
          description: "Este dispositivo já está pronto para receber notificações de novas escalas.",
          actionLabel: "Atualizar status",
          onAction: refreshNotificationStatus,
          tone: "success",
        };
      case "install_required":
        return {
          title: "Ativação no iPhone",
          statusLabel: "Instalação necessária",
          description: "Adicione o app à Tela de Início para liberar notificações no iPhone.",
          tone: "warning",
          children: <IosInstallHint />,
        };
      case "permission_denied":
        return {
          title: "Notificações bloqueadas",
          statusLabel: "Bloqueadas",
          description: "Libere as notificações nas configurações do navegador e atualize o status quando terminar.",
          actionLabel: "Atualizar status",
          onAction: refreshNotificationStatus,
          tone: "danger",
        };
      case "unsupported":
        return {
          title: "Notificações indisponíveis",
          statusLabel: "Sem suporte",
          description: "Este dispositivo ou navegador não suporta notificações web.",
          tone: "warning",
        };
      case "error":
        return {
          title: "Não foi possível ativar",
          statusLabel: "Erro",
          description: notificationsError || "Tente novamente para sincronizar este dispositivo.",
          actionLabel: "Tentar novamente",
          onAction: enableNotifications,
          tone: "danger",
        };
      default:
        return {
          title: "Receba notificações",
          statusLabel: "Desativadas",
          description: "Ative as notificações para ser avisado quando novas escalas forem criadas para você.",
          actionLabel: notificationsLoading ? "Ativando..." : "Ativar notificações",
          onAction: enableNotifications,
          tone: "default",
        };
    }
  };

  const notificationUi = getNotificationUi();

  return (
    <div className={styles.container}>
      <UserData
        edit={edit}
        setEdit={setEdit}
      />

      {!edit && (
        <>
          <div className={styles.notificationSection}>
            <NotificationStatus
              title={notificationUi.title}
              statusLabel={notificationUi.statusLabel}
              description={notificationUi.description}
              actionLabel={notificationUi.actionLabel}
              onAction={notificationUi.onAction}
              disabled={notificationsLoading}
              tone={notificationUi.tone}
            >
              {notificationUi.children}
            </NotificationStatus>
          </div>

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
