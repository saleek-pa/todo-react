import React, { useContext } from 'react';
import { TodoContext } from '../context/Context';

const SearchBar = () => {
  const { searchTerm, setSearchTerm, refetchTodos } = useContext(TodoContext);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    refetchTodos()
  };

  return (
    <form className="max-w-md mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          className="block p-3 w-60 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
          placeholder="Search Todos..."
          value={searchTerm}
          onChange={handleSearchChange}
          required
        />
      </div>
    </form>
  );
};

export default SearchBar;
