import { Link, Outlet } from "react-router-dom";
import { FiBook, FiUser, FiLogOut, FiMenu } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { logout } from "../../slices/authSlice";

const StudentLayout = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activePage } = useSelector((state) => state.ui);
  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:inset-auto`}
      >
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-indigo-600">
            Student Dashboard
          </h1>
        </div>
        <nav className="mt-6">
          <Link
            to="/student/courses"
            className={`flex items-center px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 ${
              activePage == "kurslar" ? "bg-indigo-50 text-indigo-600" : ""
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <FiBook className="mr-3" />
            Kurslar
          </Link>
          <Link
            to="/student/profile"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
            onClick={() => setSidebarOpen(false)}
          >
            <FiUser className="mr-3" />
            Profil
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <FiLogOut className="mr-3" />
            Chiqish
          </button>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-white p-4 shadow-md h-[64px]">
          <h1 className="text-lg font-bold text-indigo-600">
            Student Dashboard
          </h1>
          <button onClick={toggleSidebar} className="text-gray-600">
            <FiMenu size={24} />
          </button>
        </div>

        {/* Outlet (common for all screen sizes) */}
        <div className="flex-1 h-[100vh] p-4 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
