
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  Users,
  Gavel,
  Calendar,
  BarChart,
  Trophy,
  Settings,
  User as UserIcon
} from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const adminNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Auctions", href: "/auctions", icon: Gavel },
    { name: "Players", href: "/players", icon: Users },
    { name: "Teams", href: "/teams", icon: Trophy },
    // { name: "Matches", href: "/matches", icon: Calendar },
    // { name: "Statistics", href: "/statistics", icon: BarChart },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const teamOwnerNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Auctions", href: "/auctions", icon: Gavel },
    { name: "My Team", href: "/my-team", icon: Trophy },
    // { name: "Matches", href: "/matches", icon: Calendar },
    // { name: "Players", href: "/players", icon: Users },
    { name: "Profile", href: "/profile", icon: UserIcon },
  ];

  const navItems = user?.role === "admin" ? adminNavItems : teamOwnerNavItems;

  return (
    <aside className="fixed top-[57px] left-0 z-20 w-64 h-screen transition-transform -translate-x-full md:translate-x-0">
      <div className="h-full py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="px-3 py-3 mb-4">
          <span className="text-lg font-medium text-gray-900 dark:text-white">
            {user?.role === "admin" ? "Admin Panel" : "Team Dashboard"}
          </span>
        </div>
        <ul className="space-y-2 px-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center p-2 text-base font-normal rounded-lg",
                  location.pathname.includes(item.href)
                    ? "text-white bg-bidfy-blue"
                    : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition duration-75",
                  location.pathname.includes(item.href)
                    ? "text-white"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900"
                )} />
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
