import ScheduleDetails from "../ScheduleDetails";
import Modal from "./Modal";

function ModalViewSchedule({ schedule, onClose, onDelete, onUpdate }) {
  const handleDelete = async (deletedSchedule) => {
    if (onDelete) {
      await onDelete(deletedSchedule);
    }
    onClose();
  };

  const handleUpdate = async (updatedSchedule) => {
    if (onUpdate) {
      await onUpdate(updatedSchedule);
    }
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={schedule.name} noMarginTop={false}>
      <ScheduleDetails
        schedule={schedule}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </Modal>
  );
}

export default ModalViewSchedule;
