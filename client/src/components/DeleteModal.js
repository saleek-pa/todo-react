import { Button, Modal } from 'flowbite-react';
import { useContext } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { TodoContext } from '../context/Context';
import toast from 'react-hot-toast';

export function DeleteModal({ todoId, todoToDelete, subtaskToDelete, openModal, setOpenModal }) {
  const { deleteTodo, deleteSubtask } = useContext(TodoContext);

  const handleDelete = async () => {
    try {
      if (todoToDelete) {
        await deleteTodo(todoToDelete._id);
      } else {
        await deleteSubtask(todoId, subtaskToDelete._id);
      }
      toast.success(`${todoToDelete ? 'Task' : 'Subtask'} deleted successfully.`);
      setOpenModal(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            <span className="font-semibold">
              {todoToDelete ? todoToDelete.title : subtaskToDelete.title}
            </span>{' '}
            will be permanently deleted.
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDelete}>
              Delete
            </Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
