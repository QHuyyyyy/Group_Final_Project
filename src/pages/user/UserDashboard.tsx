import { Outlet } from 'react-router-dom';
import Menu from "../../components/user/Menu";
import Navbar from "../../components/user/NavbarUser";

export default function UserDashBoard() {
  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-[18%] md:w-[14%] lg:w-[16%] xl:w-[14%] bg-white p-6 shadow-xl flex flex-col items-center">
        {/* Menu */}
        <div className="mt-6 w-full">
          <Menu/>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-[82%] md:w-[90%] lg:w-[82%] xl:w-[82%] flex-1 bg-[#F7F8FA] overflow-scroll">
        <Navbar/>
        <Outlet />
      </div>
    </div>
  );
}
