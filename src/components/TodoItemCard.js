import { useContext } from 'react';
import { TodoContext } from './Context';
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
import { Datepicker, Select, TextInput } from 'flowbite-react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiCheckSquare } from 'react-icons/fi';
import { BsXSquare } from 'react-icons/bs';
import { FaRegEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';

const TodoItem = ({
  todo,
  todoToEdit,
  setTodoToEdit,
  setTodoToDelete,
  setOpenDeleteModal,
  setOpenCreateModal,
}) => {
  const { toggleTodo, updateTodo } = useContext(TodoContext);

  const handleEditClick = (todo) => {
    if (todo.status === 'pending') {
      setOpenCreateModal(false);
      setTodoToEdit(todo);
    } else {
      toast.error("Can't edit completed task");
    }
  };

  const handleUpdateTodo = () => {
    updateTodo(todoToEdit);
    setTodoToEdit({});
    toast.success('Task updated successfully.');
  };

  const today = new Date().toLocaleDateString();
  const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toLocaleDateString();
  const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleDateString();

  const convert24HourTo12Hour = (time) => {
    const [hour, minute] = time.split(':');
    let formattedHour = hour;
    let period = 'AM';

    if (hour > 12) {
      formattedHour = hour - 12;
      period = 'PM';
    }

    return `${formattedHour}:${minute} ${period}`;
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between border rounded-md py-3 px-5">
        {todoToEdit.id === todo.id ? (
          <>
            <div className="flex items-center gap-4">
              {todo.status === 'completed' ? (
                <MdOutlineCheckBox
                  onClick={() => toggleTodo(todo.id)}
                  className="text-2xl text-gray-400 cursor-pointer"
                />
              ) : (
                <MdOutlineCheckBoxOutlineBlank
                  onClick={() => toggleTodo(todo.id)}
                  className={'text-2xl cursor-pointer text-gray-500'}
                />
              )}
              <div>
                <TextInput
                  autoFocus
                  className="text-xxl mb-3"
                  defaultValue={todoToEdit?.title}
                  onChange={(e) =>
                    setTodoToEdit({ ...todoToEdit, title: e.target.value.trimStart() })
                  }
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
                      value={todoToEdit.time}
                      onChange={(e) => setTodoToEdit({ ...todoToEdit, time: e.target.value })}
                      className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex gap-4">
                <FiCheckSquare
                  onClick={handleUpdateTodo}
                  className="text-2xl text-gray-500 cursor-pointer"
                />
                <BsXSquare
                  onClick={() => setTodoToEdit({})}
                  className="text-2xl text-gray-500 cursor-pointer"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4">
              {todo.status === 'completed' ? (
                <MdOutlineCheckBox
                  onClick={() => {
                    toggleTodo(todo.id);
                    toast.success('Task removed from completed.');
                  }}
                  className="text-2xl text-gray-400 cursor-pointer"
                />
              ) : (
                <MdOutlineCheckBoxOutlineBlank
                  onClick={() => {
                    toggleTodo(todo.id);
                    toast.success('Task marked as completed.');
                  }}
                  className={'text-2xl cursor-pointer text-gray-500'}
                />
              )}
              <div>
                <p
                  className={`text-lg ${
                    todo.status === 'completed' ? 'text-gray-400 line-through' : ''
                  }`}
                >
                  {todo.title}
                </p>
                <div className="flex gap-1">
                  <span
                    className={`text-xs ${
                      todo.priority === '1'
                        ? 'bg-red-500'
                        : todo.priority === '2'
                        ? 'bg-yellow-300'
                        : 'bg-gray-500'
                    } text-white px-1 rounded`}
                  >
                    P{todo.priority}
                  </span>
                  <p className="text-sm text-gray-500">
                    {todo.date === today
                      ? 'Today'
                      : todo.date === yesterday
                      ? 'Yesterday'
                      : todo.date === tomorrow
                      ? 'Tomorrow'
                      : todo.date}{' '}
                    - {convert24HourTo12Hour(todo.time)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex gap-4">
                <FaRegEdit
                  onClick={() => handleEditClick(todo)}
                  className="text-2xl text-gray-500 cursor-pointer"
                />
                <RiDeleteBin6Line
                  onClick={() => {
                    setTodoToDelete(todo.id);
                    setOpenDeleteModal(true);
                  }}
                  className="text-2xl text-gray-500 cursor-pointer"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
