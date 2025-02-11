import React, { useState } from 'react';
import { HomeOutlined, ClockCircleOutlined, CompassOutlined, StarOutlined, StarFilled, PlusOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';

interface NavbarAdminProjectProps {
  favoriteProjects: string[];
  projects: any[];
  onCreateProject: () => void;
}

const NavbarAdminProject: React.FC<NavbarAdminProjectProps> = ({ favoriteProjects, projects, onCreateProject }) => {
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(false);
  
  // Lọc ra các project được yêu thích
  const favoriteProjectDetails = projects.filter(project => 
    favoriteProjects.includes(project.id)
  );

  return (
    <div className="bg-[#1E2640] h-screen w-64 fixed left-0 top-0 text-white">
      <div className="p-4">
        {/* Logo hoặc tên ứng dụng */}
        <div className="text-xl font-bold mb-8 text-center">
          Project Manager
        </div>

        {/* Các mục menu */}
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#2E3754] transition-colors">
            <HomeOutlined />
            <span>Home</span>
          </button>

          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#2E3754] transition-colors">
            <ClockCircleOutlined />
            <span>Recents</span>
          </button>

          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#2E3754] transition-colors">
            <CompassOutlined />
            <span>Browse</span>
          </button>

          {/* Favorites Section */}
          <div>
            <button 
              onClick={() => setIsFavoritesExpanded(!isFavoritesExpanded)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-[#2E3754] transition-colors"
            >
              <div className="flex items-center space-x-3">
                <StarOutlined />
                <span>Favorites</span>
              </div>
              {isFavoritesExpanded ? <DownOutlined className="text-xs" /> : <RightOutlined className="text-xs" />}
            </button>
            
            {/* Danh sách projects yêu thích - chỉ hiện khi expanded */}
            {isFavoritesExpanded && (
              <div className="ml-8 space-y-2 mt-2">
                {favoriteProjectDetails.map(project => (
                  <div 
                    key={project.id}
                    className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer px-2 py-1 rounded"
                  >
                    <StarFilled className="text-yellow-500 text-xs" />
                    <span>{project.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nút Create New Project */}
          <button 
            onClick={onCreateProject}
            className="w-full mt-6 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <PlusOutlined />
            <span>Create New Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavbarAdminProject; 