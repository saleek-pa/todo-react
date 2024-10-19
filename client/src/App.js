import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TodoProvider } from './context/TodoContext';
import { SubtaskProvider } from './context/SubtaskContext';
import { ReorderProvider } from './context/ReorderContext';
import { Toaster } from 'react-hot-toast';
import TodoHome from './pages/TodoHome';
import Register from './pages/Register';
import Login from './pages/Login';
import EditProfile from './pages/EditProfile';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <TodoProvider>
      <SubtaskProvider>
        <ReorderProvider>
          <Router>
            <Toaster position="bottom-right" reverseOrder={false} />
            <Routes>
              <Route path="/" element={<TodoHome />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<EditProfile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ReorderProvider>
      </SubtaskProvider>
    </TodoProvider>
  );
}

export default App;
