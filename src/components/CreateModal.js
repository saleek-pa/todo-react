import { useState, useRef, useContext } from 'react';
import { Button, Datepicker, Label, Modal, Select, TextInput } from 'flowbite-react';
import { TodoContext } from './Context';

const initialData = {
  title: '',
  date: new Date().toLocaleDateString(),
  time: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5),
  status: 'pending',
  priority: 3,
};

export function CreateModal({ openModal, setOpenModal }) {
  const emailInputRef = useRef(null);
  const { addTodo } = useContext(TodoContext);

  const [formData, setFormData] = useState(initialData);

  console.log(formData);

  const handleAddTodo = (e) => {
    e.preventDefault();
    addTodo(formData);
    setFormData(initialData);
    setOpenModal(false);
  };

  return (
    <Modal
      show={openModal}
      size="lg"
      popup
      onClose={() => {
        setOpenModal(false);
        setFormData(initialData);
      }}
      initialFocus={emailInputRef}
    >
      <Modal.Header />
      <Modal.Body>
        <form onSubmit={(e) => handleAddTodo(e)}>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create New Task</h3>
            <div>
              <div className="mb-2 block">
                <Label value="Title" />
              </div>
              <TextInput
                ref={emailInputRef}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value.trimStart() })}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Priority" />
              </div>
              <Select
                required
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value={1}>Priority 1</option>
                <option value={2}>Priority 2</option>
                <option value={3}>Priority 3</option>
              </Select>
            </div>
            <div className="flex gap-5 flex-wrap">
              <div className="flex-1">
                <div className="mb-2">
                  <Label value="Select Date:" />
                </div>
                <div>
                  <Datepicker
                    onChange={(e) => setFormData({ ...formData, date: e.toLocaleDateString() })}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-2">
                  <Label value="Select Time:" />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="w-full">
              <Button type="submit">Create Task</Button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
