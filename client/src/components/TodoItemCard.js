import { useState, useContext } from 'react';
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { ReorderContext } from '../context/ReorderContext';
import { AuthContext } from '../context/AuthContext';
import { TodoContext } from '../context/TodoContext';
import { Avatar } from 'flowbite-react';
import CreateSubTaskInput from './CreateSubTaskInput';
import MenuIconDropdown from './MenuIconDropdown';
import SubtaskItemCard from './SubtaskItemCard';
import AssigneeModal from './AssigneeModal';
import DragHandle from './DragHandle';
import TodoEdit from './TodoEdit';
import toast from 'react-hot-toast';

const TodoItem = ({ todo, todoToEdit, setTodoToEdit, setTodoToDelete, setOpenTodoDeleteModal }) => {
  const { user } = useContext(AuthContext);
  const { toggleTodo } = useContext(TodoContext);
  const { handleOnDragEnd } = useContext(ReorderContext);
  const [createSubTaskInput, setCreateSubTaskInput] = useState(false);
  const [isAssigneeModalOpen, setIsAssigneeModalOpen] = useState(false);

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
            <TodoEdit todo={todo} todoToEdit={todoToEdit} setTodoToEdit={setTodoToEdit} />
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
                    {todo.userId !== user?._id && (
                      <span className="text-sm">- (Created by {todo.createdUser.name})</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-5">
                {todo?.assignees?.length > 0 && (
                  <Avatar.Group>
                    {todo.assignees.map((assignee) => (
                      <Avatar
                        title={assignee.name}
                        key={assignee._id}
                        className="cursor-pointer"
                        alt="User Profile"
                        img={
                          assignee.image &&
                          `${process.env.REACT_APP_BASE_URL.slice(0, -4)}/uploads/${assignee.image}`
                        }
                        rounded
                        stacked
                      />
                    ))}
                  </Avatar.Group>
                )}

                <MenuIconDropdown
                  todo={todo}
                  setTodoToEdit={setTodoToEdit}
                  setTodoToDelete={setTodoToDelete}
                  setCreateSubTaskInput={setCreateSubTaskInput}
                  setOpenTodoDeleteModal={setOpenTodoDeleteModal}
                  setIsAssigneeModalOpen={setIsAssigneeModalOpen}
                />
              </div>
            </>
          )}
        </div>

        {isAssigneeModalOpen && (
          <AssigneeModal
            todo={todo}
            isAssigneeModalOpen={isAssigneeModalOpen}
            setIsAssigneeModalOpen={setIsAssigneeModalOpen}
          />
        )}

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
