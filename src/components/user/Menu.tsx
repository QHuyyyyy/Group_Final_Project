import { Link, useLocation } from "react-router-dom";
import { HomeOutlined } from '@ant-design/icons';
import document from "../../assets/document.png";
import settings from "../../assets/settings.svg";
import user from "../../assets/user.png";
import logout from "../../assets/logout.png";
import request from "../../assets/send.png";
import finance from "../../assets/finance.png";

interface MenuItem {
  icon?: string;
  label: string;
  href: string;
  isAntIcon?: boolean;
  antIcon?: React.ReactNode;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuData: MenuSection[] = [
  {
    title: "Menu",
    items: [
      { icon: request, label: "Requests", href: "/userdashboard/claimrequest" },
      { icon: document, label: "Approvals", href: "/userdashboard/approvals" },
      { icon: finance, label: "Finance", href: "/userdashboard/finance" },
    ],
  },
  {
    title: "Other",
    items: [
      { 
        label: "Home",
        href: "/",
        isAntIcon: true,
        antIcon: <HomeOutlined />
      },
      { icon: settings, label: "Settings", href: "/userdashboard/settings" },
      { icon: user, label: "Profile", href: "/userdashboard/profile" },
      { icon: logout, label: "Logout", href: "/userdashboard/logout" },

    ],
  },
];

const Menu = () => {
  const location = useLocation();

  return (
    <div className="bg-[#1E2640] min-h-screen w-59 fixed left-0 top-0 text-white">
      <div className="p-6">
        <div className="text-xl font-bold mb-8 text-center">User Dashboard</div>
        <div className="space-y-6">
          {menuData.map((section) => (
            <div key={section.title}>
              <span className="block text-sm font-semibold text-gray-400 mb-2 uppercase">
                {section.title}
              </span>
              <div className="flex flex-col">
                {section.items.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.href
                        ? "bg-blue-600 text-white"
                        : "hover:bg-[#2E3754] text-gray-300"
                    }`}
                  >
                    {item.isAntIcon ? (
                      <span className="text-xl">{item.antIcon}</span>
                    ) : (
                      item.icon && (
                        <img
                          src={item.icon}
                          alt={item.label}
                          className="w-5 h-5 filter invert brightness-10"
                        />
                      )
                    )}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
