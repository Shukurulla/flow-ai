import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProfile, login } from "../../api/auth";
import { loginSuccess, updateProfile } from "../../slices/authSlice";
import { toast } from "react-hot-toast";
import logo from "../../assets/logo.png";
import { FiUser, FiLock, FiLogIn } from "react-icons/fi";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { access, refresh } = await login(formData);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("access", access);
      dispatch(loginSuccess({ access, refresh }));

      const profile = await getProfile();
      dispatch(updateProfile(profile));

      toast.success("Muvaffaqiyatli kirdingiz!");
      navigate(profile.role === "student" ? "/student/courses" : "/teacher");
    } catch (error) {
      console.error(error);
      toast.error("Login yoki parol noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl">
        <div className="md:flex">
          {/* Illustration side - only visible on desktop */}
          <div className="hidden md:block md:w-1/2 bg-indigo-600 p-8 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Tizimga kirish</h2>
              <p className="mb-6">
                O'quvchi yoki o'qituvchi sifatida tizimga kiring
              </p>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 inline-block">
                <img src={logo} alt="Logo" className="h-24 w-auto" />
              </div>
            </div>
          </div>

          {/* Form side */}
          <div className="w-full md:w-1/2 p-8">
            <h1 className="text-2xl font-bold text-center mb-6 text-indigo-600">
              Tizimga kirish
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foydalanuvchi nomi
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Foydalanuvchi nomingiz"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parol
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Parolingizni kiriting"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? (
                    "Kirilmoqda..."
                  ) : (
                    <>
                      <FiLogIn className="mr-2" />
                      Tizimga kirish
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-4 text-center text-gray-600">
              Hisobingiz yo'qmi?{" "}
              <Link to="/register" className="text-indigo-600 hover:underline">
                Ro'yxatdan o'tish
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
