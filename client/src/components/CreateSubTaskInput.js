import React, { useContext, useState } from 'react';
import { TextInput } from 'flowbite-react';
import { BsXSquare } from 'react-icons/bs';
import { TodoContext } from '../context/Context';
import { FiCheckSquare } from 'react-icons/fi';
import { MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
import toast from 'react-hot-toast';

const CreateSubTaskInput = ({ setCreateSubTaskInput, todoId }) => {
  const { setOpenCreateInput, addSubTask } = useContext(TodoContext);
  const [subTaskTitle, setSubTaskTitle] = useState('');

  const handleCreateSubTask = async (e) => {
    try {
      e.preventDefault();
      await addSubTask(todoId, subTaskTitle);
      setCreateSubTaskInput(false);
      toast.success('Subtask Added.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form className="mt-4" onSubmit={handleCreateSubTask}>
      <div className="flex items-center justify-between border rounded-md py-3 px-5 gap-16 bg-white">
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
                setSubTaskTitle('');
                setOpenCreateInput(false);
              }}
              className="text-2xl text-gray-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateSubTaskInput;
