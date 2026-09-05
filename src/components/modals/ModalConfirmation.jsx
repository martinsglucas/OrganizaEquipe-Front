import { useId, useRef } from "react";
import Modal from "./Modal";
import styles from "./ModalConfirmation.module.css";

function ModalConfirmation({
  onClose,
  title,
  message,
  onConfirm,
  noMarginTop,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  pendingLabel = "Processando...",
  danger = false,
  pending = false,
}) {
  const cancelRef = useRef(null);
  const generatedMessageId = useId();
  const messageId = `modal-confirmation-${generatedMessageId.replace(/:/g, "")}`;
  const actions = (
    <div className={styles.buttons} aria-live="polite">
      <button
        ref={cancelRef}
        type="button"
        className={styles.cancel}
        onClick={onClose}
        disabled={pending}
      >
        {cancelLabel}
      </button>
      <button
        type="button"
        className={`${styles.confirm} ${danger ? styles.danger : ""}`}
        onClick={onConfirm}
        disabled={pending}
      >
        {pending ? pendingLabel : confirmLabel}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={title}
      noMarginTop={noMarginTop}
      size="sm"
      dismissible={false}
      isBusy={pending}
      showCloseButton={false}
      initialFocusRef={cancelRef}
      ariaDescribedBy={messageId}
      footer={actions}
    >
      <div className={styles.content} aria-live="polite">
        <p id={messageId} className={styles.message}>
          {message}
        </p>
      </div>
    </Modal>
  );
}

export default ModalConfirmation;
