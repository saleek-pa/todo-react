import { useState, useContext } from 'react';
import { TodoContext } from '../context/Context';
import {
  MdAccessTimeFilled,
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from 'react-icons/md';
import { Avatar, Datepicker, Dropdown, Select, TextInput, Tooltip } from 'flowbite-react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { RiDeleteBin6Line, RiUserAddLine } from 'react-icons/ri';
import { FiCheckSquare } from 'react-icons/fi';
import { HiOutlinePlus } from 'react-icons/hi';
import { BsXSquare } from 'react-icons/bs';
import { FaRegEdit } from 'react-icons/fa';
import CreateSubTaskInput from './CreateSubTaskInput';
import SubtaskItemCard from './SubtaskItemCard';
import AssigneeModal from './AssigneeModal';
import DragHandle from './DragHandle';
import toast from 'react-hot-toast';

const TodoItem = ({ todo, todoToEdit, setTodoToEdit, setTodoToDelete, setOpenTodoDeleteModal }) => {
  const { toggleTodo, updateTodo, setOpenCreateInput, handleOnDragEnd } = useContext(TodoContext);
  const [createSubTaskInput, setCreateSubTaskInput] = useState(false);
  const [isAssigneeModalOpen, setIsAssigneeModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

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
    <div className="flex-1 mb-4 border rounded-md transition-all hover:bg-gray-50 py-3 px-5">
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
                    {todo.userId !== user.id && (
                      <span className="text-sm">- (Created by {todo.createdUser.name})</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-5">
                {todo.assignees.length > 0 && (
                  <Avatar.Group>
                    {todo.assignees.map((assignee) => (
                      <Tooltip key={assignee._id} content={assignee.name}>
                        <Avatar
                          className="cursor-pointer"
                          alt="User Profile"
                          img={
                            assignee.image &&
                            `${process.env.REACT_APP_BASE_URL.slice(0, -4)}/uploads/${
                              assignee.image
                            }`
                          }
                          rounded
                          stacked
                        />
                      </Tooltip>
                    ))}
                  </Avatar.Group>
                )}

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
                      {todo.userId === user.id && (
                        <Dropdown.Item
                          icon={RiUserAddLine}
                          onClick={() => setIsAssigneeModalOpen(true)}
                        >
                          Add Assignee
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item
                        icon={HiOutlinePlus}
                        onClick={() => setCreateSubTaskInput(true)}
                      >
                        Add Sub Task
                      </Dropdown.Item>
                      <Dropdown.Item icon={FaRegEdit} onClick={() => handleEditClick(todo)}>
                        Edit
                      </Dropdown.Item>
                    </>
                  )}
                  {todo.userId === user.id && (
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
              </div>
            </>
          )}
        </div>

        <AssigneeModal
          todo={todo}
          isAssigneeModalOpen={isAssigneeModalOpen}
          setIsAssigneeModalOpen={setIsAssigneeModalOpen}
        />

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
