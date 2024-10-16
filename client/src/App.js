import Todo from './components/Todo';
import { TodoProvider } from './context/Context';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import NotFound from './components/NotFound';
import './App.css';

function App() {
  return (
    <TodoProvider>
      <Router>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Todo />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TodoProvider>
  );
}

export default App;
