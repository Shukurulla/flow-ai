import { Link, Outlet } from "react-router-dom";
import { FiBook, FiBookmark, FiUser, FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";

const StudentLayout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-xl font-bold text-indigo-600">
            Student Dashboard
          </h1>
        </div>
        <nav className="mt-6">
          <Link
            to="/student/courses"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <FiBook className="mr-3" />
            Courses
          </Link>

          <Link
            to="/student/profile"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <FiUser className="mr-3" />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <FiLogOut className="mr-3" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
