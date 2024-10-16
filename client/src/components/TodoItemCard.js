import { useState, useContext } from 'react';
import { TodoContext } from '../context/Context';
import {
  MdAccessTimeFilled,
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from 'react-icons/md';
import { Datepicker, Select, TextInput } from 'flowbite-react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiCheckSquare } from 'react-icons/fi';
import { HiOutlinePlus } from 'react-icons/hi';
import { BsXSquare } from 'react-icons/bs';
import { FaRegEdit } from 'react-icons/fa';
import CreateSubTaskInput from './CreateSubTaskInput';
import SubtaskItemCard from './SubtaskItemCard';
import DragHandle from './DragHandle';
import toast from 'react-hot-toast';

const TodoItem = ({ todo, todoToEdit, setTodoToEdit, setTodoToDelete, setOpenTodoDeleteModal }) => {
  const { toggleTodo, updateTodo, setOpenCreateInput, handleOnDragEnd } = useContext(TodoContext);
  const [createSubTaskInput, setCreateSubTaskInput] = useState(false);

  const handleEditClick = (todo) => {
    setOpenCreateInput(false);
    setTodoToEdit(todo);
  };

  const handleUpdateTodo = async (todoId) => {
    try {
      await updateTodo(todoId, todoToEdit);
      setTodoToEdit({});
      toast.success('Task updated successfully.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const todoDate = new Date(todo.date).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' });
  const today = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' });
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
    <div className="flex-1 mb-4 border rounded-md transition-all hover:bg-gray-100 py-3 px-5">
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          {todoToEdit._id === todo._id ? (
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
                      onChange={(e) =>
                        setTodoToEdit({ ...todoToEdit, date: e.toLocaleDateString() })
                      }
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
                <div className="flex gap-4">
                  <FiCheckSquare
                    onClick={() => handleUpdateTodo(todoToEdit._id)}
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
                      toggleTodo(todo._id);
                      toast.success('Task moved to pending.');
                    }}
                    className="text-2xl text-gray-400 cursor-pointer"
                  />
                ) : (
                  <MdOutlineCheckBoxOutlineBlank
                    onClick={() => {
                      toggleTodo(todo._id);
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
                        todo.priority === 1
                          ? 'bg-red-500'
                          : todo.priority === 2
                          ? 'bg-yellow-300'
                          : 'bg-gray-500'
                      } text-white px-1 rounded`}
                    >
                      P{todo.priority}
                    </span>
                    <p className="text-sm text-gray-500">
                      {todoDate === today
                        ? 'Today'
                        : todoDate === yesterday
                        ? 'Yesterday'
                        : todoDate === tomorrow
                        ? 'Tomorrow'
                        : todoDate}{' '}
                      - {convert24HourTo12Hour(todo.time)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-4">
                {todo.status === 'pending' && (
                  <>
                    <div
                      className="flex justify-center items-center gap-2 cursor-pointer me-1.5"
                      onClick={() => setCreateSubTaskInput(true)}
                    >
                      <p className="text-blue-500">Add Sub Task</p>
                      <HiOutlinePlus className="text-xl text-gray-500" />
                    </div>
                    <FaRegEdit
                      onClick={() => handleEditClick(todo)}
                      className="text-2xl text-gray-500 cursor-pointer"
                    />
                  </>
                )}
                <RiDeleteBin6Line
                  onClick={() => {
                    setTodoToDelete(todo);
                    setOpenTodoDeleteModal(true);
                  }}
                  className="text-2xl text-gray-500 cursor-pointer transition-all hover:text-red-400"
                />
              </div>
            </>
          )}
        </div>

        <DragDropContext onDragEnd={(result) => handleOnDragEnd(result, todo)}>
          <Droppable droppableId="subTasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {todo.subTasks?.map((subTask, index) => (
                  <Draggable key={subTask._id} draggableId={subTask._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex justify-center items-center"
                      >
                        <DragHandle {...provided.dragHandleProps} className="mt-3" />
                        <SubtaskItemCard
                          todoId={todo._id}
                          subTask={subTask}
                          setCreateSubTaskInput={setCreateSubTaskInput}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {createSubTaskInput && (
          <CreateSubTaskInput todoId={todo._id} setCreateSubTaskInput={setCreateSubTaskInput} />
        )}
      </div>
    </div>
  );
};

export default TodoItem;
