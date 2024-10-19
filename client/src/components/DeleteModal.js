import { useContext, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { SubtaskContext } from '../context/SubtaskContext';
import { Button, Modal } from 'flowbite-react';
import { TodoContext } from '../context/TodoContext';
import toast from 'react-hot-toast';

export default function DeleteModal({
  todoId,
  todoToDelete,
  subtaskToDelete,
  openModal,
  setOpenModal,
}) {
  const { deleteTodo } = useContext(TodoContext);
  const { deleteSubtask } = useContext(SubtaskContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      if (todoToDelete) {
        await deleteTodo(todoToDelete._id);
      } else {
        await deleteSubtask(todoId, subtaskToDelete._id);
      }
      toast.success(`${todoToDelete ? 'Task' : 'Subtask'} deleted successfully.`);
      setOpenModal(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
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
            <Button color="failure" disabled={isLoading} onClick={handleDelete}>
              {isLoading ? (
                <div className="w-5 h-5 border-4 mx-3 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
              ) : (
                'Delete'
              )}
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
