import { Button, Modal } from 'flowbite-react';
import { useContext } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { TodoContext } from '../context/Context';
import toast from 'react-hot-toast';

export function DeleteModal({ todoToDelete, openModal, setOpenModal }) {
  const { deleteTodo } = useContext(TodoContext);

  const handleDelete = () => {
    deleteTodo(todoToDelete._id);
    toast.error('Task deleted successfully.');
    setOpenModal(false);
  };

  return (
    <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            "{todoToDelete.title}" will be permanently deleted.
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
