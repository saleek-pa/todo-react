import React, { useState, useContext } from 'react';
import { Button } from 'flowbite-react';
import { DeleteModal } from './DeleteModal';
import { TodoContext } from '../context/Context';
import CreateTodoInput from './CreateTodoInput';
import CustomDropdown from './Dropdown';
import TodoItem from './TodoItemCard';
import SearchBar from './SearchBar';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const TodoList = () => {
  const { todos, selectedPriorities, openCreateInput, setOpenCreateInput, reorderTodos } =
    useContext(TodoContext);
  const [todoToEdit, setTodoToEdit] = useState({});
  const [todoToDelete, setTodoToDelete] = useState({});
  const [openTodoDeleteModal, setOpenTodoDeleteModal] = useState(false);

  const handleOnDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    reorderTodos(source, destination);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Todo</h1>
        <div className="flex items-center gap-2">
          <SearchBar />
          <CustomDropdown />
          <Button
            onClick={() => setOpenCreateInput(true)}
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            Create Task
          </Button>
        </div>
      </div>

      {openCreateInput && <CreateTodoInput />}

      {!todos || (todos?.pendingTodos.length === 0 && todos?.completedTodos.length === 0) ? (
        <p className="text-center text-gray-500 mt-16 text-2xl">No tasks available.</p>
      ) : (
        <>
          {selectedPriorities.length > 0 && (
            <p className="mb-2">Showing Priority {selectedPriorities.join(', ')} Tasks</p>
          )}

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="pendingTodos">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="mb-8">
                  {todos?.pendingTodos.map((todo, index) => (
                    <Draggable key={todo._id} draggableId={todo._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TodoItem
                            key={todo._id}
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

          {todos?.completedTodos.length > 0 && (
            <div className="opacity-50">
              <h2 className="text-xl font-semibold mb-4">Completed</h2>
              {todos?.completedTodos.map((todo) => (
                <TodoItem
                  key={todo._id}
                  todo={todo}
                  setOpenTodoDeleteModal={setOpenTodoDeleteModal}
                  todoToEdit={todoToEdit}
                  setTodoToEdit={setTodoToEdit}
                  setTodoToDelete={setTodoToDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      {openTodoDeleteModal && (
        <DeleteModal
          todoToDelete={todoToDelete}
          openModal={openTodoDeleteModal}
          setOpenModal={setOpenTodoDeleteModal}
        />
      )}
    </div>
  );
};

export default TodoList;
