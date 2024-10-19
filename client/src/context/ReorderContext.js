import { createContext, useContext } from 'react';
import { makePutRequest } from '../configs/Axios';
import { TodoContext } from './TodoContext';

export const ReorderContext = createContext();

export const ReorderProvider = ({ children }) => {
  const { todos } = useContext(TodoContext);

  const reorderTodos = async (type, source, destination) => {
    try {
      const [removed] = todos[type]?.pendingTodos.splice(source.index, 1);
      todos[type]?.pendingTodos.splice(destination.index, 0, removed);

      const updatedTodos = todos[type]?.pendingTodos.concat(todos[type]?.completedTodos);
      const reorderedTodos = updatedTodos.map((todo, index) => ({
        _id: todo._id,
        order: index + 1,
      }));
      const response = await makePutRequest(`/todos/reorder`, { reorderedTodos });
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Error reordering task');
      }
    } catch (error) {
      throw error;
    }
  };

  const reorderSubtask = async (todo, source, destination) => {
    try {
      const [removed] = todo.subTasks.splice(source.index, 1);
      todo.subTasks.splice(destination.index, 0, removed);

      const reorderedSubtasks = todo.subTasks.map((subTask, index) => ({
        _id: subTask._id,
        order: index + 1,
      }));
      const response = await makePutRequest(`/todos/${todo._id}/subtasks/reorder`, {
        reorderedSubtasks,
      });
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Error reordering subtask');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleOnDragEnd = (result, todo = {}) => {
    const { type, source, destination } = result;
    if (!destination) return;
    if (source.droppableId === 'pendingTodos') {
      reorderTodos(type, source, destination);
    }
    if (source.droppableId === 'subTasks') {
      reorderSubtask(todo, source, destination);
    }
  };

  const value = {
    reorderTodos,
    reorderSubtask,
    handleOnDragEnd,
  };

  return <ReorderContext.Provider value={value}>{children}</ReorderContext.Provider>;
};
