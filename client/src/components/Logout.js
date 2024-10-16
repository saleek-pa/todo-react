import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TodoContext } from '../context/Context';

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
              <button
                className="bg-gray-300 transition-all hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 transition-all hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleLogOut}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutModal;
