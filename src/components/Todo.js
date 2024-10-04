import React, { useContext, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Button } from 'flowbite-react';
import { CreateModal } from './CreateModal';
import { UpdateModal } from './UpdateModal';
import { DeleteModal } from './DeleteModal';
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
import { TodoContext } from './Context';

const TodoList = () => {
  const { todos, toggleTodo } = useContext(TodoContext);
  const [openInputModal, setOpenInputModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState('');

  const pending = todos.filter((todo) => todo.status === 'pending');
  const completed = todos.filter((todo) => todo.status === 'completed');

  const today = new Date().toLocaleDateString();
  const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toLocaleDateString();
  const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleDateString();

  function convert24HourTo12Hour(time) {
    const [hour, minute] = time.split(':');
    let formattedHour = hour;
    let period = 'AM';

    if (hour > 12) {
      formattedHour = hour - 12;
      period = 'PM';
    }

    return `${formattedHour}:${minute} ${period}`;
  }

  const TodoItem = ({ todo }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between border rounded-md py-3 px-5">
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
              onClick={() => {
                setSelectedTodoId(todo.id);
                setOpenUpdateModal(true);
              }}
              className="text-2xl text-gray-500 cursor-pointer"
            />
            <RiDeleteBin6Line
              onClick={() => {
                setSelectedTodoId(todo.id);
                setOpenDeleteModal(true);
              }}
              className="text-2xl text-gray-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="max-w-3xl mx-auto p-6 my-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Todo</h1>
          <Button
            onClick={() => setOpenInputModal(true)}
            variant="secondary"
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            Create Task
          </Button>
          {openInputModal && (
            <CreateModal openModal={openInputModal} setOpenModal={setOpenInputModal} />
          )}
        </div>

        <div className="mb-8">
          {pending.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4">Completed</h2>
        <div className="opacity-50">
          {completed?.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
        {openUpdateModal && (
          <UpdateModal
            todoId={selectedTodoId}
            openModal={openUpdateModal}
            setOpenModal={setOpenUpdateModal}
          />
        )}
        {openDeleteModal && (
          <DeleteModal
            todoId={selectedTodoId}
            openModal={openDeleteModal}
            setOpenModal={setOpenDeleteModal}
          />
        )}
      </div>
    </>
  );
};

export default TodoList;
