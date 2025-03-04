import { Link, useLocation } from "react-router-dom";
import document from "../../assets/document.png";
import user from "../../assets/user.png";
import request from "../../assets/send.png";
import finance from "../../assets/finance.png";
import home from "../../assets/home.png";
import transaction from "../../assets/transaction.png";
import { useUserStore } from "../../stores/userStore";

interface MenuItem {
  icon?: string;
  label: string;
  href: string;
  isAntIcon?: boolean;
  antIcon?: React.ReactNode;
  allowedRoles: string[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const Menu = () => {
  const location = useLocation();
  const userRole = useUserStore((state) => state.role_code);

  const menuData: MenuSection[] = [
    {
      title: "Menu",
      items: [
        { 
          icon: request, 
          label: "Requests", 
          href: "/userdashboard/claimrequest",
          allowedRoles: ["A004"]
        },
        { 
          icon: document, 
          label: "Approvals", 
          href: "/userdashboard/approvals",
          allowedRoles: ["A002", "A003"]
        },
        { 
          icon: finance, 
          label: "Finance", 
          href: "/userdashboard/finance",
          allowedRoles: ["A002"]
        },
        { 
          icon: transaction, 
          label: "Transaction", 
          href: "/userdashboard/transaction",
          allowedRoles: ["A004"]
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          icon: home, 
          label: "Home", 
          href: "/",
          allowedRoles: ["A001", "A002", "A003", "A004"]
        },
        { 
          icon: user, 
          label: "Profile", 
          href: "/userdashboard/profile",
          allowedRoles: ["A001", "A002", "A003", "A004"]
        },
      ],
    },
  ];

  // Lọc các section có ít nhất một item được phép hiển thị
  const filteredMenuData = menuData
    .map(section => ({
      ...section,
      items: section.items.filter(item => item.allowedRoles.includes(userRole))
    }))
    .filter(section => section.items.length > 0);

    return (
      <div className="bg-[#1E2640] min-h-screen w-64 fixed left-0 top-0 text-white">
        <div className="p-6">
          <div className="text-xl font-bold mb-8 text-center">User Dashboard</div>
          <div className="space-y-6">
            {filteredMenuData.map((section) => (
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