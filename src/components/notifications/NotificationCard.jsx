import styles from "./NotificationCard.module.css";

function NotificationCard({
  title,
  description,
  actionLabel,
  onAction,
  disabled = false,
  tone = "default",
  children,
}) {
  return (
    <section className={`${styles.card} ${styles[tone] || ""}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
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

export default NotificationCard;
