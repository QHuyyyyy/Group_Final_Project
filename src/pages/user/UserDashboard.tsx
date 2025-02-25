import { Outlet } from 'react-router-dom';
import Menu from "../../components/user/Menu";
import Navbar from "../../components/user/NavbarUser";

export default function UserDashBoard() {
  return (
    <div className="h-screen flex">
      
      <Menu/>
      {/* Content Area */}
      <div className="w-[82%] md:w-[90%] lg:w-[82%] xl:w-[82%] flex-1 bg-[#F7F8FA] overflow-scroll ml-60">
        <Navbar/>
        <div className="h-full p-4 bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
