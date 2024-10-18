import React, { useContext, useState } from 'react';
import { TodoContext } from '../context/Context';
import { MdAccessTimeFilled, MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
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
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTodo = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      await addTodo(formData);
      setFormData(initialData);
      setOpenCreateInput(false);
      toast.success('Task added successfully.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mb-4" onSubmit={handleAddTodo}>
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
                  <MdAccessTimeFilled className="text-gray-500" />
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
          <div className="flex justify-center items-center gap-4">
            {isLoading ? (
              <div className="w-7 h-7 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
            ) : (
              <button type="submit">
                <FiCheckSquare className="text-2xl text-gray-500 cursor-pointer" />
              </button>
            )}
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
    </form>
  );
};

export default CreateTodoInput;
