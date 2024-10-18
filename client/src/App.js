import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TodoProvider } from './context/Context';
import TodoHome from './components/TodoHome';
import Register from './components/Register';
import Login from './components/Login';
import NotFound from './components/NotFound';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <TodoProvider>
      <Router>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<TodoHome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TodoProvider>
  );
}

export default App;
