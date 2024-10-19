import React, { useContext, useState } from 'react';
import {
  MdAccessTimeFilled,
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from 'react-icons/md';
import { Datepicker, Select, TextInput } from 'flowbite-react';
import { FiCheckSquare } from 'react-icons/fi';
import { TodoContext } from '../context/TodoContext';
import { BsXSquare } from 'react-icons/bs';
import toast from 'react-hot-toast';

const TodoEdit = ({ todo, todoToEdit, setTodoToEdit }) => {
  const { toggleTodo, updateTodo } = useContext(TodoContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateTodo = async (todoId) => {
    try {
      setIsLoading(true);
      await updateTodo(todoId, todoToEdit);
      setTodoToEdit({});
      toast.success('Task updated successfully.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        {todo.status === 'completed' ? (
          <MdOutlineCheckBox
            onClick={() => toggleTodo(todo._id)}
            className="text-2xl text-gray-400 cursor-pointer"
          />
        ) : (
          <MdOutlineCheckBoxOutlineBlank
            onClick={() => toggleTodo(todo._id)}
            className={'text-2xl cursor-pointer text-gray-500'}
          />
        )}
        <div>
          <TextInput
            autoFocus
            className="text-xxl mb-3"
            defaultValue={todoToEdit?.title}
            onChange={(e) => setTodoToEdit({ ...todoToEdit, title: e.target.value.trimStart() })}
            required
          />
          <div className="flex flex-wrap gap-3">
            <Select
              required
              defaultValue={todoToEdit?.priority}
              onChange={(e) => setTodoToEdit({ ...todoToEdit, priority: e.target.value })}
            >
              <option value={1}>Priority 1</option>
              <option value={2}>Priority 2</option>
              <option value={3}>Priority 3</option>
            </Select>
            <Datepicker
              value={new Date(todoToEdit.date)}
              onChange={(e) => setTodoToEdit({ ...todoToEdit, date: e.toLocaleDateString() })}
            />
            <div className="relative">
              <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                <MdAccessTimeFilled className="text-gray-500" />
              </div>
              <input
                type="time"
                value={todoToEdit.time}
                onChange={(e) => setTodoToEdit({ ...todoToEdit, time: e.target.value })}
                className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-7 h-7 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
          ) : (
            <FiCheckSquare
              onClick={() => handleUpdateTodo(todoToEdit._id)}
              className="text-2xl text-gray-500 cursor-pointer"
            />
          )}
          <BsXSquare
            onClick={() => setTodoToEdit({})}
            className="text-2xl text-gray-500 cursor-pointer"
          />
        </div>
      </div>
    </>
  );
};

export default TodoEdit;
