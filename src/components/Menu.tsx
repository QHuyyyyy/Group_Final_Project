import { Link } from "react-router-dom";
import document from "../assets/document.png";
import settings from "../assets/settings.svg";
import user from "../assets/user.png";
import logout from "../assets/logout.png";
import request from "../assets/send.png"
import finance from "../assets/finance.png";

const menuData = [
  {
    title: "Menu",
    items: [
      { icon: request, label: "Requests", href: "/dashboard/claimrequest" },
      { icon: document, label: "Approvals", href: "/dashboard/approvals" },
      { icon: finance, label: "Finance", href: "/dashboard/finance" },
    ],
    
  },
  { 
    title: "Other",
    items: [
      { icon: settings, label: "Settings", href: "/dashboard/settings" },
      { icon: user, label: "Profile", href: "/dashboard/profile" },
      { icon: logout, label: "Logout", href: "/dashboard/logout" },
    ],
  }
];

const Menu = () => {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-5 ">
      <h1 className="text-xl font-bold text-gray-900 mb-4 text-center">User Dashboard</h1>
      <div className="space-y-6 ">
        {menuData.map((section) => (
          <div key={section.title}>
            <span className="block text-lg font-semibold text-gray-700 mb-2">{section.title}</span>
            <div className="flex flex-col gap-2">
              {section.items.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="flex items-center space-x-3 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg transition-all"
                >
                  <img src={item.icon} alt={item.label} className="w-6 h-6" />
                  <span className="text-lg">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
