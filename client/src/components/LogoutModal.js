import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TodoContext } from '../context/TodoContext';
import { Button } from 'flowbite-react';

const LogoutModal = ({ showLogoutModal, setShowLogoutModal }) => {
  const { setTodos } = useContext(TodoContext);
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowLogoutModal(false);
    navigate('/login');
    setTodos({});
  };

  return (
    <>
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4">
              <Button color="gray" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </Button>
              <Button color="failure" onClick={handleLogOut}>
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutModal;
