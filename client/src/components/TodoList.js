import React, { useContext, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ReorderContext } from '../context/ReorderContext';
import DragHandle from './DragHandle';
import TodoItem from './TodoItemCard';

const TodoList = ({ type, todos, setOpenTodoDeleteModal, setTodoToDelete }) => {
  const { handleOnDragEnd } = useContext(ReorderContext);
  const [todoToEdit, setTodoToEdit] = useState({});

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="pendingTodos" type={type}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {todos[type]?.pendingTodos?.map((todo, index) => (
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
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {todos[type]?.completedTodos.length > 0 && (
        <div className="opacity-50 ms-7">
          <h2 className="text-xl font-semibold mb-4">Completed</h2>
          {todos[type]?.completedTodos?.map((todo) => (
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
