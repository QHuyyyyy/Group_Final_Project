import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="bg-black shadow-md w-full fixed top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-white">
          ClaimRequest
        </div>
        {/* Navigation Links */}
        <div className="flex space-x-4">
          <a href="#" className="text-white hover:text-amber-700">About</a>
          <a href="#" className="text-white hover:text-amber-700">Services</a>
          <a href="#" className="text-white hover:text-amber-700">Industries</a>
          <a href="#" className="text-white hover:text-amber-700">Careers</a>
          <a href="#" className="text-white hover:text-amber-700">Contact</a>
        </div>
        {/* Login Button */}
        <div>
          <button className="bg-white text-black border px-4 py-2 rounded hover:bg-amber-700 hover:text-white transition-colors">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
