import React, { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';
import { RiDeleteBin6Line, RiUserAddLine } from 'react-icons/ri';
import { HiOutlinePlus } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { FaRegEdit } from 'react-icons/fa';
import { Dropdown } from 'flowbite-react';

const MenuIconDropdown = ({
  todo,
  setTodoToEdit,
  setTodoToDelete,
  setIsAssigneeModalOpen,
  setCreateSubTaskInput,
  setOpenTodoDeleteModal,
}) => {
  const { user } = useSelector((state) => state.user);
  const { setOpenCreateInput } = useContext(TodoContext);

  const handleEditClick = (todo) => {
    setOpenCreateInput(false);
    setTodoToEdit(todo);
  };

  return (
    <Dropdown
      label=""
      dismissOnClick={true}
      renderTrigger={() => (
        <button
          type="button"
          className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 4 15"
          >
            <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
          </svg>
        </button>
      )}
    >
      {todo.status === 'pending' && (
        <>
          {todo.userId === user?._id && (
            <Dropdown.Item icon={RiUserAddLine} onClick={() => setIsAssigneeModalOpen(true)}>
              Manage Assignee
            </Dropdown.Item>
          )}
          <Dropdown.Item icon={HiOutlinePlus} onClick={() => setCreateSubTaskInput(true)}>
            Add Sub Task
          </Dropdown.Item>
          <Dropdown.Item icon={FaRegEdit} onClick={() => handleEditClick(todo)}>
            Edit
          </Dropdown.Item>
        </>
      )}
      {todo.userId === user?._id && (
        <Dropdown.Item
          icon={RiDeleteBin6Line}
          onClick={() => {
            setTodoToDelete(todo);
            setOpenTodoDeleteModal(true);
          }}
        >
          Delete
        </Dropdown.Item>
      )}
    </Dropdown>
  );
};

export default MenuIconDropdown;
