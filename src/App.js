import Todo from './components/Todo';
import './App.css';
import { TodoProvider } from './components/Context';

function App() {
  return (
    <TodoProvider>
      <Todo />
    </TodoProvider>
  );
}

export default App;
