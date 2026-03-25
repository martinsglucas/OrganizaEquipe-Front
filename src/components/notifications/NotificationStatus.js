import styles from "./NotificationCard.module.css";

function NotificationStatus({
  title,
  statusLabel,
  description,
  actionLabel,
  onAction,
  disabled = false,
  tone = "default",
  children,
}) {
  return (
    <section className={`${styles.card} ${styles[tone] || ""}`}>
      <div className={styles.statusHeader}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {statusLabel && <span className={styles.badge}>{statusLabel}</span>}
      </div>

      {children && <div className={styles.content}>{children}</div>}

      {actionLabel && onAction && (
        <div className={styles.actions}>
          <button className={styles.button} onClick={onAction} disabled={disabled}>
            {actionLabel}
          </button>
        </div>
      )}
    </section>
  );
}

export default NotificationStatus;
