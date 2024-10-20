import React, { useContext, useEffect, useState } from 'react';
import { TodoContext } from '../context/TodoContext';
import { getAllUsers } from '../redux/userSlice';
import { IoIosSearch } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { Button } from 'flowbite-react';
import toast from 'react-hot-toast';

const AssigneeModal = ({ todo, isAssigneeModalOpen, setIsAssigneeModalOpen }) => {
  const { assignTodoToUser } = useContext(TodoContext);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState(todo?.assigneeIds);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        if (isAssigneeModalOpen) {
          const response = await dispatch(getAllUsers()).unwrap();
          setUsers(response.data);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchAllUsers();
    // eslint-disable-next-line
  }, [isAssigneeModalOpen]);

  const handleAddAssignee = async () => {
    try {
      setIsLoading(true);
      await assignTodoToUser(todo._id, selectedUsers);
      setIsAssigneeModalOpen(false);
      toast.success('Assignee updated successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={() => setIsAssigneeModalOpen(false)}
      ></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-96">
        <h2 className="text-xl font-bold mb-4">Add Assignee</h2>
        <div className="p-3">
          <label className="sr-only">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <IoIosSearch className="text-lg" />
            </div>
            <input
              type="text"
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search user"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200">
          {filteredUsers.map((user) => (
            <li key={user._id}>
              <div
                onClick={() => handleUserClick(user._id)}
                className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <input
                  readOnly
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                />
                <label className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                  {user.name}
                </label>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-end items-center mt-5 gap-3">
          <Button color="gray" onClick={() => setIsAssigneeModalOpen(false)}>
            Cancel
          </Button>

          <Button color="blue" onClick={handleAddAssignee} disabled={isLoading}>
            {isLoading ? (
              <div className="w-5 h-5 border-4 mx-3 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssigneeModal;
