import React, { useContext, useState } from 'react';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { TodoContext } from './Context';

const CustomDropdown = () => {
  const { todos, filterTodo, selectedPriorities, setSelectedPriorities } = useContext(TodoContext);
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: '1', label: 'Priority 1' },
    { value: '2', label: 'Priority 2' },
    { value: '3', label: 'Priority 3' },
  ];

  const handleFilterByPriority = (value) => {
    const updatedSelection = selectedPriorities.includes(value)
      ? selectedPriorities.filter((priority) => priority !== value)
      : [...selectedPriorities, value];

    setSelectedPriorities(updatedSelection);
    filterTodo(todos, updatedSelection);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex  justify-center content-center w-40 bg-white border border-gray-300 rounded-md p-2 text-left focus:outline-none"
      >
        Filter by Priority
        <RiArrowDropDownLine className="text-2xl" />
      </button>
      {isOpen && (
        <div
          onMouseLeave={() => setIsOpen(false)}
          className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10"
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleFilterByPriority(option.value)}
              className={'flex items-center p-2 hover:bg-gray-100 cursor-pointer'}
            >
              <span className="mr-2">
                {selectedPriorities.includes(option.value) ? (
                  <ImCheckboxChecked />
                ) : (
                  <ImCheckboxUnchecked />
                )}
              </span>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
