import { MdShare } from "react-icons/md";
import { toast } from "react-toastify";

import styles from "./ScheduleShareButton.module.css";

function ScheduleShareButton({ scheduleId, scheduleName }) {
  const shareSchedule = async () => {
    const url = new URL(
      `/escala/${encodeURIComponent(scheduleId)}`,
      window.location.origin
    ).toString();

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: scheduleName,
          text: scheduleName,
          url,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          toast.error(
            "Não foi possível compartilhar a escala. Tente copiar o endereço no navegador."
          );
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link da escala copiado!");
    } catch {
      toast.error(
        "Não foi possível copiar o link. Copie o endereço diretamente do navegador."
      );
    }
  };

  return (
    <button type="button" className={styles.button} onClick={shareSchedule}>
      <MdShare aria-hidden="true" />
      <span>Compartilhar</span>
    </button>
  );
}

export default ScheduleShareButton;
