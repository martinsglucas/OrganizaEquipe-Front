import styles from "./ModalLoading.module.css";
import { useState, useEffect } from "react";
import Loading from "../Loading"
import { createPortal } from "react-dom"

function ModalLoading({ isOpen }) {
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

  const modal = (
    <div className={styles.background}>
      <div
        className={`${styles.container} ${
          isClosing ? styles.slide_down : styles.slide_up
        }`}
      >
        {/* <h3>Carregando...</h3> */}
        <Loading />
      </div>
    </div>
  );
  
  return createPortal(modal, document.body)
}

export default ModalLoading;