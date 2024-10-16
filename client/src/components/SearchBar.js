import React, { useContext } from 'react';
import { TodoContext } from '../context/Context';
import { IoIosSearch } from 'react-icons/io';

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useContext(TodoContext);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form className="max-w-md mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <IoIosSearch className="text-lg" />
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
