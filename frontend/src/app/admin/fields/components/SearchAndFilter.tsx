'use client'

import { FaSearch, FaFilter } from 'react-icons/fa'

type SearchAndFilterProps = {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filterType: string
  setFilterType: (type: string) => void
}

export default function SearchAndFilter({ 
  searchTerm, 
  setSearchTerm, 
  filterType, 
  setFilterType 
}: SearchAndFilterProps) {
  return (
    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          placeholder="Search fields..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="relative w-full md:w-56">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaFilter className="h-4 w-4 text-gray-400" />
        </div>
        <select
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Field Types</option>
          <option value="text">Text Fields</option>
          <option value="number">Number Fields</option>
          <option value="select">Dropdown Fields</option>
          <option value="checkbox">Checkbox Fields</option>
          <option value="textarea">Text Area Fields</option>
        </select>
      </div>
    </div>
  )
}
