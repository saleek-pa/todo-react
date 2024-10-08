import Todo from './components/Todo';
import './App.css';
import { TodoProvider } from './context/Context';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <TodoProvider>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Todo />
    </TodoProvider>
  );
}

export default App;
