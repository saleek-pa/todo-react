import React, { useContext, useState } from 'react';
import { TodoContext } from '../context/Context';
import { MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
import { Datepicker, Select, TextInput } from 'flowbite-react';
import { FiCheckSquare } from 'react-icons/fi';
import { BsXSquare } from 'react-icons/bs';
import toast from 'react-hot-toast';

const initialData = {
  title: '',
  date: new Date().toLocaleDateString(),
  time: new Date().toTimeString().slice(0, 5),
  status: 'pending',
  priority: 3,
};

const CreateTodoInput = () => {
  const { addTodo, setOpenCreateInput } = useContext(TodoContext);
  const [formData, setFormData] = useState(initialData);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      addTodo(formData);
      setFormData(initialData);
      setOpenCreateInput(false);
      toast.success('Task added successfully.');
    } else {
      toast.error('Title is empty.');
    }
  };
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between border rounded-md py-3 px-5">
        <div className="flex items-center gap-4">
          <MdOutlineCheckBoxOutlineBlank className="text-2xl cursor-pointer text-gray-500" />
          <div>
            <TextInput
              autoFocus
              placeholder="Title"
              className="text-xxl mb-3"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value.trimStart() })}
              required
            />
            <div className="flex flex-wrap gap-3">
              <Select
                required
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="1">Priority 1</option>
                <option value="2">Priority 2</option>
                <option value="3">Priority 3</option>
              </Select>
              <Datepicker
                onChange={(e) => setFormData({ ...formData, date: e.toLocaleDateString() })}
              />
              <div className="relative">
                <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-4">
            <FiCheckSquare
              onClick={(e) => handleAddTodo(e)}
              className="text-2xl text-gray-500 cursor-pointer"
            />
            <BsXSquare
              onClick={() => {
                setFormData(initialData);
                setOpenCreateInput(false);
              }}
              className="text-2xl text-gray-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTodoInput;
