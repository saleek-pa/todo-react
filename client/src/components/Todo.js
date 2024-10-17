import React, { useState, useContext, useEffect } from 'react';
import { Avatar, Button, Dropdown } from 'flowbite-react';
import { DeleteModal } from './DeleteModal';
import { TodoContext } from '../context/Context';
import CreateTodoInput from './CreateTodoInput';
import CustomDropdown from './Dropdown';
import TodoItem from './TodoItemCard';
import SearchBar from './SearchBar';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DragHandle from './DragHandle';
import LogoutModal from './LogoutModal';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from './EditProfileModal';

const TodoList = () => {
  const {
    user,
    todos,
    selectedPriorities,
    openCreateInput,
    setOpenCreateInput,
    handleOnDragEnd,
    fetchTodos,
    searchTerm,
  } = useContext(TodoContext);
  const [todoToEdit, setTodoToEdit] = useState({});
  const [todoToDelete, setTodoToDelete] = useState({});
  const [openTodoDeleteModal, setOpenTodoDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchTodos();
    } else {
      navigate('/login');
    }
  }, [selectedPriorities, searchTerm]);

  return (
    <div className="max-w-3xl mx-auto p-6 my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Todo</h1>
        <div className="flex items-center gap-2">
          <SearchBar />
          <CustomDropdown />
          <Button
            onClick={() => setOpenCreateInput(true)}
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            Create Task
          </Button>
        </div>

        <Dropdown
          label={
            <Avatar
              alt="User Profile"
              img={
                user.image && `${process.env.REACT_APP_BASE_URL.slice(0, -4)}/uploads/${user.image}`
              }
              rounded
            />
          }
          arrowIcon={false}
          inline
        >
          <Dropdown.Header>
            <span className="block text-sm">{user.name}</span>
            <span className="block truncate text-sm font-medium">{user.email}</span>
          </Dropdown.Header>
          <Dropdown.Item onClick={() => setShowEditProfileModal(true)}>Edit Profile</Dropdown.Item>
          <Dropdown.Item onClick={() => setShowLogoutModal(true)} className="text-red-600">
            Log Out
          </Dropdown.Item>
        </Dropdown>
      </div>

      <EditProfileModal show={showEditProfileModal} setShow={setShowEditProfileModal} />

      <LogoutModal showLogoutModal={showLogoutModal} setShowLogoutModal={setShowLogoutModal} />

      {openCreateInput && <CreateTodoInput />}

      {!todos || (todos?.pendingTodos?.length === 0 && todos?.completedTodos?.length === 0) ? (
        <p className="text-center text-gray-500 mt-16 text-2xl">No tasks available.</p>
      ) : (
        <>
          {selectedPriorities?.length > 0 && (
            <p className="mb-2">Showing Priority {selectedPriorities.join(', ')} Tasks</p>
          )}

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="pendingTodos">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {todos?.pendingTodos?.map((todo, index) => (
                    <Draggable key={todo._id} index={index} draggableId={todo._id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex justify-center"
                        >
                          <DragHandle {...provided.dragHandleProps} className="py-3 mb-4" />
                          <TodoItem
                            todo={todo}
                            setOpenTodoDeleteModal={setOpenTodoDeleteModal}
                            todoToEdit={todoToEdit}
                            setTodoToEdit={setTodoToEdit}
                            setTodoToDelete={setTodoToDelete}
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

          {todos?.completedTodos?.length > 0 && (
            <div className="opacity-50">
              <h2 className="text-xl font-semibold mb-4">Completed</h2>
              {todos?.completedTodos?.map((todo) => (
                <TodoItem
                  key={todo._id}
                  todo={todo}
                  setOpenTodoDeleteModal={setOpenTodoDeleteModal}
                  todoToEdit={todoToEdit}
                  setTodoToEdit={setTodoToEdit}
                  setTodoToDelete={setTodoToDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      {openTodoDeleteModal && (
        <DeleteModal
          todoToDelete={todoToDelete}
          openModal={openTodoDeleteModal}
          setOpenModal={setOpenTodoDeleteModal}
        />
      )}
    </div>
  );
};

export default TodoList;
