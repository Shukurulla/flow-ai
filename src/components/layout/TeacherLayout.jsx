import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiBook, FiUser, FiLogOut, FiMenu, FiArrowLeft } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { logout } from "../../slices/authSlice";
import logo from "../../assets/logo.png";

const TeacherLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  // Sahifa aktivligini aniqlash
  const getActivePage = () => {
    const path = location.pathname;
    if (path === "/teacher" || path.startsWith("/teacher/courses"))
      return "courses";
    if (path.startsWith("/teacher/profile")) return "profile";
    return "";
  };

  const activePage = getActivePage();

  const handleLogout = () => {
    if (window.confirm("Rostan ham tizimdan chiqmoqchimisiz?")) {
      dispatch(logout());
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header - butun sahifa uzunligida */}
      <header className="bg-white shadow-md h-16 flex items-center justify-between px-4 w-full">
        <h1 className="text-xl font-bold flex items-center gap-2 text-indigo-600">
          <img src={logo} className="w-[40px] h-[40px]" alt="" /> Teacher
        </h1>
        <button onClick={toggleSidebar} className="text-gray-600 md:hidden">
          <FiMenu size={24} />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - faqat desktop uchun */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static`}
        >
          <nav className="mt-6">
            <Link
              to="/teacher"
              className={`flex items-center px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 ${
                activePage === "courses" ? "bg-indigo-50 text-indigo-600" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <FiBook className="mr-3" />
              Mening Kurslarim
            </Link>
            <Link
              to="/teacher/profile"
              className={`flex items-center px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 ${
                activePage === "profile" ? "bg-indigo-50 text-indigo-600" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <FiUser className="mr-3" />
              Profil
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <FiLogOut className="mr-3" />
              Chiqish
            </button>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main content - to'liq uzunlikda */}
        <main className="flex-1 overflow-auto p-4">
          {window.location.pathname == "/student" ||
          window.location.pathname == "/teacher" ? (
            " "
          ) : (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
              <FiArrowLeft className="mr-1" /> Orqaga
            </button>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
