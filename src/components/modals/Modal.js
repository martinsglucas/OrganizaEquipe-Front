import styles from "./Modal.module.css";
import { IoIosArrowDown } from "react-icons/io";
import { useState, useEffect } from "react";

function Modal({ isOpen, onClose, title, children, noMarginTop }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    } else if (!isOpen && isVisible) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [isOpen, isVisible]);

  if (!isVisible && !isClosing) return null;
  
  return (
    <div className={styles.background}>
      <div
        className={`${styles.container} ${
          isClosing ? styles.slide_down : styles.slide_up
        } ${noMarginTop ? styles.no_margin_top : ""}`}
      >
        <div className={styles.header}>
          <IoIosArrowDown className={styles.back} onClick={onClose} />
          <h1>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;