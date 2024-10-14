import React, { useContext, useState } from 'react';
import { TodoContext } from '../context/Context';
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
import { TextInput } from 'flowbite-react';
import { FiCheckSquare } from 'react-icons/fi';
import { BsXSquare } from 'react-icons/bs';
import toast from 'react-hot-toast';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { DeleteModal } from './DeleteModal';

const SubtaskItemCard = ({ subTask, todoId, setCreateSubTaskInput }) => {
  const { toggleSubtask, updateSubTask, setOpenCreateInput } = useContext(TodoContext);
  const [subTaskToEdit, setSubTaskToEdit] = useState(false);
  const [subTaskTitle, setSubTaskTitle] = useState('');
  const [subtaskToDelete, setSubtaskToDelete] = useState({});
  const [openSubtaskDeleteModal, setOpenSubtaskDeleteModal] = useState(false);

  return (
    <div className="flex flex-1 justify-between px-5 border rounded-md py-2 mt-3">
      {subTaskToEdit._id === subTask._id ? (
        <>
          <div className="flex flex-1 items-center justify-between py-3 gap-16">
            <div className="flex flex-1 items-center justify-center gap-4">
              <MdOutlineCheckBoxOutlineBlank className="text-2xl cursor-pointer text-gray-500" />
              <TextInput
                autoFocus
                placeholder="Title"
                className="text-xxl flex-1"
                defaultValue={subTaskToEdit.title}
                onChange={(e) => setSubTaskTitle(e.target.value.trimStart())}
                required
              />
            </div>
            <div className="flex gap-2">
              <div className="flex gap-4">
                <FiCheckSquare
                  onClick={() => {
                    updateSubTask(todoId, subTask._id, subTaskTitle);
                    setSubTaskToEdit({});
                  }}
                  className="text-2xl text-gray-500 cursor-pointer"
                />
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
          </div>
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
            {!subTask.completed && (
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
            />
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
