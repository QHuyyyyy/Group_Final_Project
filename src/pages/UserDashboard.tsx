import { Route, Routes } from "react-router-dom";
import Menu from "../components/Menu";
import Navbar from "../components/Narbar";
import Approval from "../components/Approval";
import Request from "../components/Request";
import Finance from "../components/Finance";



export default function UserDashBoard() {
  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-[18%] md:w-[14%] lg:w-[16%] xl:w-[14%] bg-white p-6 shadow-xl flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="hidden lg:block text-2xl font-semibold text-gray-900">Claim Request</span>
        </div>
        {/* Menu */}
        <div className="mt-6 w-full">
          <Menu/>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-[82%] md:w-[90%] lg:w-[82%] xl:w-[82%] flex-1 bg-[#F7F8FA] overflow-scroll">
      <Navbar/>
      <Routes>
          <Route path="/approvals" element={<Approval/>} />
          <Route path="/claimrequest" element={<Request/>} />
          <Route path="/finance" element={<Finance/>} />
      </Routes>
        
      </div>
    </div>
  );
}
