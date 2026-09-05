import styles from "./Accordion.module.css";
import { useId, useState } from "react";

const Accordion = ({ title, icon, content, edit, onEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const generatedId = useId().replace(/:/g, "");
  const triggerId = `accordion-trigger-${generatedId}`;
  const contentId = `accordion-content-${generatedId}`;

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit();
  };

  return (
    <div className={styles.item}>
      <button
        id={triggerId}
        className={styles.button}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <div className={styles.title}>
          {icon && <div className={styles.iconTitle}>{icon}</div>}
          {title}
        </div>
        <span className={styles.iconOpen}>{isOpen ? "−" : "+"}</span>
      </button>
      <div
        id={contentId}
        className={`${styles.content} ${isOpen ? styles.open : ""}`}
        role="region"
        aria-labelledby={triggerId}
        hidden={!isOpen}
      >
        {content.length > 0 ? (
          <ul className={styles.list}>
            {content.map((item) => (
              <li key={item.id}>{item.content}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>Nenhum item cadastrado.</p>
        )}
        <div className={styles.edit}>
          {edit && (
            <button className={styles.buttonEdit} onClick={handleEditClick}>
              Editar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
