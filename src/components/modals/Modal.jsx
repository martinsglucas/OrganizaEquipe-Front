import styles from "./Modal.module.css";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

const activeDialogs = [];
let originalBodyOverflow = "";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const getFocusableElements = (dialog) =>
  Array.from(dialog.querySelectorAll(focusableSelector)).filter(
    (element) => element.getAttribute("aria-hidden") !== "true"
  );

const getInitialFocusTarget = (dialog, initialFocusRef) => {
  const focusableElements = getFocusableElements(dialog);
  return (
    initialFocusRef?.current ||
    focusableElements.find((element) => !element.hasAttribute("data-modal-close")) ||
    focusableElements[0] ||
    dialog
  );
};

const isTopmostDialog = (dialog) => {
  const dialogs = document.querySelectorAll('[data-shared-dialog="true"]');
  return dialogs[dialogs.length - 1] === dialog;
};

function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  noMarginTop,
  size = "md",
  dismissible = true,
  isBusy = false,
  closeOnBackdrop = false,
  closeOnEscape = false,
  showCloseButton = true,
  initialFocusRef,
  ariaDescribedBy,
}) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const generatedTitleId = useId();
  const titleId = `modal-title-${generatedTitleId.replace(/:/g, "")}`;
  const canDismiss = dismissible && !isBusy;

  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;

    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    if (!dialog) return undefined;

    if (activeDialogs.length === 0) {
      originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    activeDialogs.push(dialog);

    getInitialFocusTarget(dialog, initialFocusRef).focus();

    return () => {
      const dialogIndex = activeDialogs.lastIndexOf(dialog);
      if (dialogIndex >= 0) activeDialogs.splice(dialogIndex, 1);

      if (activeDialogs.length === 0) {
        document.body.style.overflow = originalBodyOverflow;
      }

      if (trigger?.isConnected && typeof trigger.focus === "function") {
        trigger.focus();
      }
    };
  }, [initialFocusRef, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      const dialog = dialogRef.current;
      if (!dialog || !isTopmostDialog(dialog)) return;

      if (event.key === "Escape") {
        if (canDismiss && closeOnEscape) {
          event.preventDefault();
          event.stopPropagation();
          onCloseRef.current?.();
        }
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements(dialog);
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (!dialog.contains(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
      } else if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [canDismiss, closeOnEscape, isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  const handleBackdropClick = (event) => {
    if (
      event.target === event.currentTarget &&
      isTopmostDialog(dialogRef.current) &&
      canDismiss &&
      closeOnBackdrop
    ) {
      onCloseRef.current?.();
    }
  };

  return createPortal(
    <div className={styles.background} onMouseDown={handleBackdropClick}>
      <div
        ref={dialogRef}
        className={`${styles.container} ${styles[size] || styles.md} ${
          noMarginTop ? styles.no_margin_top : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={ariaDescribedBy}
        aria-busy={isBusy || undefined}
        data-shared-dialog="true"
        tabIndex={-1}
      >
        <div className={styles.header}>
          {showCloseButton && (
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => onCloseRef.current?.()}
              disabled={!canDismiss}
              aria-label="Fechar"
              data-modal-close
            >
              <IoIosArrowDown aria-hidden="true" />
            </button>
          )}
          <h1 id={titleId}>{title}</h1>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
