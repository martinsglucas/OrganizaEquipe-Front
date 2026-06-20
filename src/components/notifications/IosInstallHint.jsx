import styles from "./NotificationCard.module.css";

function IosInstallHint() {
  return (
    <ol className={styles.list}>
      <li>Abra o app no Safari.</li>
      <li>Toque em Compartilhar.</li>
      <li>Escolha Adicionar à Tela de Início.</li>
      <li>Abra o app instalado.</li>
      <li>Toque em Ativar notificações.</li>
    </ol>
  );
}

export default IosInstallHint;
