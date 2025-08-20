import styles from "./Accordion.module.css";
import { useState, useRef } from "react";

const Accordion = ({ title, icon, content, edit, onEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit();
  };

  return (
    <div className={styles.item}>
      <button className={styles.button} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.title}>
          {icon && <div className={styles.iconTitle}>{icon}</div>}
          {title}
        </div>
        <span className={styles.iconOpen}>{isOpen ? "−" : "+"}</span>
      </button>
      <div
        ref={contentRef}
        className={`${styles.content} ${isOpen ? styles.open : ""}`}
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
        }}
      >
        <ul className={styles.list}>
          {content.map((item) => (
            <li key={item.id}>{item.content}</li>
          ))}
        </ul>
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
