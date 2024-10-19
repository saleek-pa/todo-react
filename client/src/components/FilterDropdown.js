import React, { useContext, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { TodoContext } from '../context/TodoContext';
import { Button } from 'flowbite-react';

const FilterDropdown = () => {
  const { selectedPriorities, setSelectedPriorities } = useContext(TodoContext);
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: 1, label: 'Priority 1' },
    { value: 2, label: 'Priority 2' },
    { value: 3, label: 'Priority 3' },
  ];

  const handleFilterByPriority = (value) => {
    const updatedSelection = selectedPriorities.includes(value)
      ? selectedPriorities.filter((priority) => priority !== value)
      : [...selectedPriorities, value];

    setSelectedPriorities(updatedSelection);
  };

  return (
    <div className="relative">
      <Button color="gray" onClick={() => setIsOpen(!isOpen)}>
        Filter <RiArrowDropDownLine className="text-2xl" />
      </Button>
      {isOpen && (
        <div
          onMouseLeave={() => setIsOpen(false)}
          className="absolute left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 dark:bg-gray-700"
        >
          <ul
            className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownBgHoverButton"
          >
            {options.map((option) => (
              <li key={option.value} onClick={() => handleFilterByPriority(option.value)}>
                <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                  <input
                    readOnly
                    type="checkbox"
                    checked={selectedPriorities.includes(option.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                    {option.label}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
