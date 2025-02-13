import { FC } from "react";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <div className="mb-6 space-y-4">  
        <div className="md:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã nhân viên..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
    </div>
  );
};

export default SearchBar;
