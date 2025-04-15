import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import { toast } from "react-hot-toast";
import logo from "../../assets/logo.png";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "998",
    password: "",
    confirm_password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Telefon raqamini formatlash
    if (name === "phone_number") {
      // Faqat raqamlar va maksimal 9 ta raqam
      const cleanedValue = value.replace(/\D/g, "").slice(0, 12);
      if (cleanedValue.length > 2) {
        // Format: 998 90 123 45 67
        const formattedValue = cleanedValue.replace(
          /(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
          "$1 $2 $3 $4 $5"
        );
        setFormData({ ...formData, phone_number: formattedValue });
      } else {
        setFormData({ ...formData, phone_number: cleanedValue });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      toast.error("Parollar mos kelmadi");
      return;
    }

    setLoading(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        phone_number: `+${formData.phone_number.replace(/\s/g, "")}`,
        password: formData.password,
        password2: formData.confirm_password,
        role: formData.role,
      });
      toast.success(
        "Ro'yxatdan muvaffaqiyatli o'tdingiz! Iltimos, tizimga kiring."
      );
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Ro'yxatdan o'tishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (
      step === 1 &&
      (!formData.username || !formData.email || !formData.phone_number)
    ) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl">
        <div className="md:flex">
          {/* Illustration side - only visible on desktop */}
          <div className="hidden md:block md:w-1/2 bg-indigo-600 p-8 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Yangi hisob yarating</h2>
              <p className="mb-6">
                O'quv yoki o'qituvchi sifatida ro'yxatdan o'ting
              </p>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 inline-block">
                <img src={logo} alt="" />
              </div>
            </div>
          </div>

          {/* Form side */}
          <div className="w-full md:w-1/2 p-8">
            <h1 className="text-2xl font-bold text-center mb-6 text-indigo-600">
              Ro'yxatdan o'tish
            </h1>

            <form onSubmit={handleSubmit}>
              {/* Step 1 */}
              <div
                className={`transition-all duration-300 ${
                  step === 1 ? "block" : "hidden md:block"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                      Elektron pochta
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Elektron pochtangiz"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon raqami
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <div className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-500">
                      +
                    </div>
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="90 123 45 67"
                      className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Format: 90 123 45 67
                  </p>
                </div>

                {window.innerWidth < 768 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center"
                  >
                    Keyingisi <FiChevronRight className="ml-2" />
                  </button>
                )}
              </div>

              {/* Step 2 */}
              <div
                className={`transition-all duration-300 ${
                  step === 2 ? "block" : "hidden md:block"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                        placeholder="Kuchli parol yarating"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parolni tasdiqlang
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        placeholder="Parolni qayta kiriting"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ro'l
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="student">O'quvchi</option>
                    <option value="teacher">O'qituvchi</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  {window.innerWidth < 768 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
                    >
                      <FiChevronLeft className="mr-2" /> Oldingisi
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`${
                      window.innerWidth < 768 ? "flex-1" : "w-full"
                    } bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center disabled:opacity-50`}
                  >
                    {loading ? "Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish"}
                  </button>
                </div>
              </div>
            </form>

            <p className="mt-4 text-center text-gray-600">
              Hisobingiz bormi?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Tizimga kirish
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
