import { Outlet } from 'react-router-dom';
import Menu from "../../components/user/Menu";
import Navbar from "../../components/user/NavbarUser";

export default function UserDashBoard() {
  return (
    <div className="flex min-h-screen">
      <Menu />

      <div className="flex-1 ml-64 bg-gray-100">
        <Navbar />
        <div className="p-8 mt-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}