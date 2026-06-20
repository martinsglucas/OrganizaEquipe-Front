import Modal from "./Modal";
import styles from "./ModalConfirmation.module.css";

function ModalConfirmation({ onClose, title, message, onConfirm, noMarginTop }) {
  return ( 
    <Modal isOpen={true} onClose={onClose} title={title} noMarginTop={noMarginTop}>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttons}>
          <button className={styles.cancel} onClick={onClose}>Cancelar</button>
          <button className={styles.confirm} onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </Modal>
   );
}

export default ModalConfirmation;