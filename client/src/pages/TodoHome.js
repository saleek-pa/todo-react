import React, { useState, useContext, useEffect } from 'react';
import { Avatar, Button, Dropdown, Tabs } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { LuUser2, LuUserCheck } from 'react-icons/lu';
import { getUserProfile } from '../redux/userSlice';
import { TodoContext } from '../context/TodoContext';
import { useNavigate } from 'react-router-dom';
import CreateTodoInput from '../components/CreateTodoInput';
import CustomDropdown from '../components/FilterDropdown';
import DeleteModal from '../components/DeleteModal';
import LogoutModal from '../components/LogoutModal';
import SearchBar from '../components/SearchBar';
import TodoList from '../components/TodoList';
import toast from 'react-hot-toast';

const TodoHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { fetchTodos, todos, openCreateInput, setOpenCreateInput, selectedPriorities, searchTerm } =
    useContext(TodoContext);

  const [todoToDelete, setTodoToDelete] = useState({});
  const [openTodoDeleteModal, setOpenTodoDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (localStorage.getItem('token')) {
          await fetchTodos();
          await dispatch(getUserProfile()).unwrap();
        } else {
          navigate('/login');
        }
      } catch (error) {
        toast.error(error);
      }
    };

    fetchData();

    // eslint-disable-next-line
  }, [selectedPriorities, searchTerm]);

  return (
    <div className="max-w-3xl mx-auto p-6 my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Todo</h1>
        <div className="flex items-center gap-2">
          <SearchBar />
          <CustomDropdown />
          <Button onClick={() => setOpenCreateInput(true)}>Create Task</Button>
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
          <Dropdown.Item onClick={() => navigate('/profile')}>Edit Profile</Dropdown.Item>
          <Dropdown.Item onClick={() => setShowLogoutModal(true)} className="text-red-600">
            Log Out
          </Dropdown.Item>
        </Dropdown>
      </div>

      <LogoutModal showLogoutModal={showLogoutModal} setShowLogoutModal={setShowLogoutModal} />

      <Tabs aria-label="Default tabs" variant="default">
        <Tabs.Item active title="My Tasks" icon={LuUser2}>
          {openCreateInput && <CreateTodoInput />}

          {selectedPriorities?.length > 0 && (
            <p className="mb-2">Showing Priority {selectedPriorities.sort().join(', ')} Tasks</p>
          )}

          {!todos ||
          (todos?.createdTodos?.pendingTodos?.length === 0 &&
            todos?.createdTodos?.completedTodos?.length === 0) ? (
            <p className="text-center text-gray-500 mt-16 text-2xl">No tasks available.</p>
          ) : (
            <TodoList
              todos={todos}
              type={'createdTodos'}
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
            <TodoList
              todos={todos}
              type={'assignedTodos'}
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
