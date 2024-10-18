import React, { useContext, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TodoContext } from '../context/Context';
import DragHandle from './DragHandle';
import TodoItem from './TodoItemCard';

const TodoList = ({ setOpenTodoDeleteModal, setTodoToDelete }) => {
  const { user, todos, selectedPriorities, handleOnDragEnd } = useContext(TodoContext);
  const [todoToEdit, setTodoToEdit] = useState({});

  return (
    <>
      {selectedPriorities?.length > 0 && (
        <p className="mb-2">Showing Priority {selectedPriorities.join(', ')} Tasks</p>
      )}

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="pendingTodos" type="createdTodos">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {todos?.createdTodos?.pendingTodos?.map(
                (todo, index) =>
                  !todo.assigneeIds.includes(user._id) && (
                    <Draggable key={todo._id} index={index} draggableId={todo._id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex justify-center"
                        >
                          <DragHandle
                            {...provided.dragHandleProps}
                            className="flex items-center mb-4"
                          />
                          <TodoItem
                            todo={todo}
                            setOpenTodoDeleteModal={setOpenTodoDeleteModal}
                            todoToEdit={todoToEdit}
                            setTodoToEdit={setTodoToEdit}
                            setTodoToDelete={setTodoToDelete}
                          />
                        </div>
                      )}
                    </Draggable>
                  )
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {todos?.createdTodos?.completedTodos.length > 0 && (
        <div className="opacity-50">
          <h2 className="text-xl font-semibold mb-4">Completed</h2>
          {todos?.createdTodos?.completedTodos?.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              todoToEdit={todoToEdit}
              setTodoToEdit={setTodoToEdit}
              setTodoToDelete={setTodoToDelete}
              setOpenTodoDeleteModal={setOpenTodoDeleteModal}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default TodoList;
