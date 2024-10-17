import React, { useContext, useEffect, useState } from 'react';
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
import { Dropdown, TextInput } from 'flowbite-react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiCheckSquare } from 'react-icons/fi';
import { TodoContext } from '../context/Context';
import { DeleteModal } from './DeleteModal';
import { BsXSquare } from 'react-icons/bs';
import { FaRegEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SubtaskItemCard = ({ subTask, todoId, setCreateSubTaskInput }) => {
  const { toggleSubtask, updateSubTask, setOpenCreateInput } = useContext(TodoContext);
  const [subTaskToEdit, setSubTaskToEdit] = useState(false);
  const [subTaskTitle, setSubTaskTitle] = useState('');
  const [subtaskToDelete, setSubtaskToDelete] = useState({});
  const [openSubtaskDeleteModal, setOpenSubtaskDeleteModal] = useState(false);

  useEffect(() => {
    if (subTaskToEdit) {
      setSubTaskTitle(subTaskToEdit.title || '');
    }
  }, [subTaskToEdit]);

  return (
    <div className="flex flex-1 justify-between px-5 border rounded-md py-2 mt-3">
      {subTaskToEdit._id === subTask._id ? (
        <>
          <form
            onSubmit={() => {
              updateSubTask(todoId, subTask._id, subTaskTitle);
              setSubTaskToEdit({});
              toast.success('Sub task updated');
            }}
            className="flex flex-1 items-center justify-between py-3 gap-16"
          >
            <div className="flex flex-1 items-center justify-center gap-4">
              <MdOutlineCheckBoxOutlineBlank className="text-2xl cursor-pointer text-gray-500" />
              <TextInput
                autoFocus
                placeholder="Title"
                className="text-xxl flex-1"
                value={subTaskTitle}
                onChange={(e) => setSubTaskTitle(e.target.value.trimStart())}
                required
              />
            </div>
            <div className="flex gap-2">
              <div className="flex gap-4">
                <button type="submit">
                  <FiCheckSquare className="text-2xl text-gray-500 cursor-pointer" />
                </button>
                <BsXSquare
                  onClick={() => {
                    setCreateSubTaskInput(false);
                    setSubTaskToEdit({});
                    setOpenCreateInput(false);
                  }}
                  className="text-2xl text-gray-500 cursor-pointer"
                />
              </div>
            </div>
          </form>
        </>
      ) : (
        <>
          <div className="flex items-center gap-4">
            {subTask.completed ? (
              <MdOutlineCheckBox
                onClick={() => {
                  toggleSubtask(todoId, subTask._id);
                  toast.success('Subtask moved to pending.');
                }}
                className="text-2xl text-gray-400 cursor-pointer"
              />
            ) : (
              <MdOutlineCheckBoxOutlineBlank
                onClick={() => {
                  toggleSubtask(todoId, subTask._id);
                  toast.success('Subtask marked as completed.');
                }}
                className={'text-2xl cursor-pointer text-gray-500'}
              />
            )}
            <p className={`text-lg ${subTask.completed ? 'text-gray-400 line-through' : ''}`}>
              {subTask.title}
            </p>
          </div>
          <div
            className={`flex justify-center items-center ${
              subTask.completed ? 'opacity-50' : ''
            } gap-4`}
          >
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
              <Dropdown.Item icon={FaRegEdit} onClick={() => setSubTaskToEdit(subTask)}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item
                icon={RiDeleteBin6Line}
                onClick={() => {
                  setSubtaskToDelete(subTask);
                  setOpenSubtaskDeleteModal(true);
                }}
              >
                Delete
              </Dropdown.Item>
            </Dropdown>
            {/* {!subTask.completed && (
              <FaRegEdit
                onClick={() => setSubTaskToEdit(subTask)}
                className="text-2xl text-gray-500 cursor-pointer"
              />
            )}
            <RiDeleteBin6Line
              onClick={() => {
                setSubtaskToDelete(subTask);
                setOpenSubtaskDeleteModal(true);
              }}
              className="text-2xl text-gray-500 cursor-pointer transition-all hover:text-red-400"
            /> */}
          </div>
        </>
      )}

      {openSubtaskDeleteModal && (
        <DeleteModal
          todoId={todoId}
          subtaskToDelete={subtaskToDelete}
          openModal={openSubtaskDeleteModal}
          setOpenModal={setOpenSubtaskDeleteModal}
        />
      )}
    </div>
  );
};

export default SubtaskItemCard;
