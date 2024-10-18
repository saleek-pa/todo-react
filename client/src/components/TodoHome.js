import React, { useState, useContext, useEffect } from 'react';
import { Avatar, Button, Dropdown, Tabs } from 'flowbite-react';
import { LuUser2, LuUserCheck } from 'react-icons/lu';
import { TodoContext } from '../context/Context';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from './EditProfileModal';
import CreateTodoInput from './CreateTodoInput';
import CustomDropdown from './FilterDropdown';
import DeleteModal from './DeleteModal';
import SearchBar from './SearchBar';
import LogoutModal from './LogoutModal';
import TodoList from './TodoList';
import AssignedTodoList from './AssignedTodoList';

const TodoHome = () => {
  const {
    user,
    todos,
    selectedPriorities,
    openCreateInput,
    setOpenCreateInput,
    fetchTodos,
    searchTerm,
  } = useContext(TodoContext);
  const [todoToDelete, setTodoToDelete] = useState({});
  const [openTodoDeleteModal, setOpenTodoDeleteModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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

      <Tabs aria-label="Default tabs" variant="default">
        <Tabs.Item active title="My Tasks" icon={LuUser2}>
          {openCreateInput && <CreateTodoInput />}
          {!todos ||
          (todos?.createdTodos?.pendingTodos?.length === 0 &&
            todos?.createdTodos?.completedTodos?.length === 0) ? (
            <p className="text-center text-gray-500 mt-16 text-2xl">No tasks available.</p>
          ) : (
            <TodoList
              setTodoToDelete={setTodoToDelete}
              setOpenTodoDeleteModal={setOpenTodoDeleteModal}
            />
          )}
        </Tabs.Item>

        <Tabs.Item title="Assigned to me" icon={LuUserCheck}>
          {!todos ||
          (todos?.assignedTodos?.pendingTodos?.length === 0 &&
            todos?.assignedTodos?.completedTodos?.length === 0) ? (
            <p className="text-center text-gray-500 mt-16 text-2xl">No tasks available.</p>
          ) : (
            <AssignedTodoList
              setTodoToDelete={setTodoToDelete}
              setOpenTodoDeleteModal={setOpenTodoDeleteModal}
            />
          )}
        </Tabs.Item>
      </Tabs>

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

export default TodoHome;
