import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../api/auth";
import { toast } from "react-hot-toast";
import { updateProfile } from "../slices/authSlice";
import { FiEdit, FiCamera, FiSave, FiLoader } from "react-icons/fi";

const Profile = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    image: null,
    previewImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        image: null,
        previewImage: user.image || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Xatoliklarni tozalash
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Fayl hajmini tekshirish (masalan, 2MB dan oshmasligi kerak)
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, image: "Rasm hajmi 2MB dan oshmasligi kerak" });
        return;
      }

      setFormData({
        ...formData,
        image: file,
        previewImage: URL.createObjectURL(file),
      });
      setErrors({ ...errors, image: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username majburiy";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email majburiy";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Noto'g'ri email formati";
    }

    if (
      formData.phone_number &&
      !/^\+?[0-9]{9,15}$/.test(formData.phone_number)
    ) {
      newErrors.phone_number = "Noto'g'ri telefon raqami formati";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append("username", formData.username);
      formPayload.append("email", formData.email);
      if (formData.phone_number) {
        formPayload.append("phone_number", formData.phone_number);
      }
      if (formData.image) {
        formPayload.append("image", formData.image);
      }

      const updatedProfile = await updateUserProfile(formPayload, accessToken);
      dispatch(updateProfile(updatedProfile));
      toast.success("Profil muvaffaqiyatli yangilandi!");
    } catch (error) {
      console.error("Profilni yangilashda xatolik:", error);

      // API dan kelgan xatoliklarni qayta ishlash
      if (error.response?.data) {
        const apiErrors = error.response.data;
        if (apiErrors.username) {
          setErrors({ ...errors, username: apiErrors.username.join(" ") });
        }
        if (apiErrors.email) {
          setErrors({ ...errors, email: apiErrors.email.join(" ") });
        }
        if (apiErrors.phone_number) {
          setErrors({
            ...errors,
            phone_number: apiErrors.phone_number.join(" "),
          });
        }
        if (apiErrors.image) {
          setErrors({ ...errors, image: apiErrors.image.join(" ") });
        }
      }

      toast.error("Profilni yangilashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">
              Profilni tahrirlash
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Rasm qismi */}
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden">
                  {formData.previewImage ? (
                    <img
                      src={`https://akkanat.pythonanywhere.com${formData.previewImage}`}
                      alt="Profil rasmi"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500">
                      {user?.username?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <label className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100">
                    <FiCamera className="text-indigo-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
              </div>

              {/* Forma qismi */}
              <div className="flex-1 space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Foydalanuvchi nomi *
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Elektron pochta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone_number"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Telefon raqami
                  </label>
                  <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.phone_number ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="+998901234567"
                  />
                  {errors.phone_number && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone_number}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Saqlanmoqda...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    O'zgarishlarni saqlash
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
