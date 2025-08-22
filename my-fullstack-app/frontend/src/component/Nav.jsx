import React, { useContext, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";

const Nav = () => {
  const { userdata, setUserData } = useContext(userDataContext);
  const { serverUrl } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const navigate = useNavigate();

  if (!userdata) return null;

  const userInitial = useMemo(
    () => (userdata.name ? userdata.name[0].toUpperCase() : "U"),
    [userdata.name]
  );


  const links = useMemo(() => {
    return userdata.role === "admin"
      ? [
          { name: "Dashboard", path: "/admin/dashboard" },
          { name: "Add Lead", path: "/add" },
          { name: "Lead List", path: "/leadlist" },
          { name: "Salesperson Performance", path: "/salesperson" },
        ]
      : [
          { name: "Dashboard", path: "/sales/dashboard" },
          { name: "Sales Leads", path: "/sales/leads" },
        ];
  }, [userdata.role]);

  
  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  const handleLogout = useCallback(async () => {
    setLoadingLogout(true);
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Logout failed!");
    } finally {
      setLoadingLogout(false);
      setDropdownOpen(false);
    }
  }, [serverUrl, navigate, setUserData]);

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center fixed w-full z-50 shadow-md">
      {/* Brand */}
      <div>
        <span
          className="text-2xl font-bold cursor-pointer"
          onClick={() =>
            handleNavigate(userdata.role === "admin" ? "/admin/dashboard" : "/sales/dashboard")
          }
        >
          Lead Management
        </span>
      </div>

      {/* Links */}
      <ul className="flex items-center space-x-6">
        {links.map((link) => (
          <li key={link.path}>
            <span
              className="cursor-pointer hover:text-gray-300"
              onClick={() => handleNavigate(link.path)}
            >
              {link.name}
            </span>
          </li>
        ))}

        {/* User Dropdown */}
        <li className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold"
          >
            {userInitial}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow py-2">
              <button
                onClick={handleLogout}
                disabled={loadingLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                {loadingLogout ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

// ✅ Memoize whole component
export default React.memo(Nav);
