import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Heart, CalendarCheck } from "lucide-react";

const navItems = [
  { icon: Home, label: "Doctors", path: "/" },
  { icon: Heart, label: "Favorites", path: "/favorites" },
  { icon: CalendarCheck, label: "Appointments", path: "/appointments" },
];

export function Navbar() {
  const [activeItem, setActiveItem] = useState("/");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setActiveItem(path);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-blue-600 font-bold text-xl">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-12 w-auto" // Adjust height and set width to auto to maintain aspect ratio
              />
            </span>
          </div>
          <div className="hidden sm:block">
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  className={`${
                    activeItem === item.path
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-blue-100"
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center`}
                  aria-current={activeItem === item.path ? "page" : undefined}
                >
                  <item.icon className="mr-2 h-5 w-5" aria-hidden="true" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="sm:hidden">
        <div className="flex justify-around border-t border-gray-200">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              className={`${
                activeItem === item.path
                  ? "text-blue-500"
                  : "text-gray-500 hover:text-blue-500"
              } flex-1 group inline-flex flex-col items-center text-xs font-medium py-3 px-2`}
              aria-current={activeItem === item.path ? "page" : undefined}
            >
              <item.icon
                className={`${
                  activeItem === item.path
                    ? "text-blue-500"
                    : "text-gray-400 group-hover:text-blue-500"
                } h-6 w-6 mb-1 transition-colors duration-200`}
                aria-hidden="true"
              />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
