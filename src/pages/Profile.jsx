import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../api/auth";
import { toast } from "react-hot-toast";
import { updateProfile } from "../slices/authSlice";
import {
  FiEdit,
  FiCamera,
  FiSave,
  FiLoader,
  FiMail,
  FiPhone,
  FiUser,
} from "react-icons/fi";

const Profile = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    image: null,
    previewImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        phone_number: user.phone_number || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        image: null,
        previewImage: user.image || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
      formPayload.append("email", formData.email);
      if (formData.phone_number) {
        formPayload.append("phone_number", formData.phone_number);
      }
      if (formData.first_name) {
        formPayload.append("first_name", formData.first_name);
      }
      if (formData.last_name) {
        formPayload.append("last_name", formData.last_name);
      }
      if (formData.image) {
        formPayload.append("image", formData.image);
      }

      const updatedProfile = await updateUserProfile(formPayload, accessToken);
      dispatch(updateProfile(updatedProfile));
      toast.success("Profil muvaffaqiyatli yangilandi!");
    } catch (error) {
      console.error("Profilni yangilashda xatolik:", error);

      if (error.response?.data) {
        const apiErrors = error.response.data;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <FiUser className="mr-2" />
              Profilni tahrirlash
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center w-full md:w-1/3">
                <div className="relative w-40 h-40 rounded-full bg-gray-200 mb-4 overflow-hidden border-4 border-white shadow-lg">
                  {formData.previewImage ? (
                    <img
                      src={`https://akkanat.pythonanywhere.com${formData.previewImage}`}
                      alt="Profil rasmi"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-gray-500 font-bold">
                      {user?.username?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <label className="absolute bottom-3 right-3 bg-indigo-100 p-2 rounded-full shadow-md cursor-pointer hover:bg-indigo-200 transition-colors">
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
                  <p className="text-red-500 text-sm mt-1 text-center">
                    {errors.image}
                  </p>
                )}

                {/* Username Display (non-editable) */}
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {user?.username}
                  </h3>
                  <p className="text-sm text-gray-500">Foydalanuvchi nomi</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-6">
                {/* Email Field */}
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <FiMail className="mr-2 text-indigo-600" />
                    Elektron pochta *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="example@mail.com"
                    />
                    <FiMail className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number Field */}
                <div className="space-y-1">
                  <label
                    htmlFor="phone_number"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <FiPhone className="mr-2 text-indigo-600" />
                    Telefon raqami
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="phone_number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.phone_number
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="+998901234567"
                    />
                    <FiPhone className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  {errors.phone_number && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone_number}
                    </p>
                  )}
                </div>

                {/* First Name Field */}
                {/* <div className="space-y-1">
                  <label
                    htmlFor="first_name"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <FiUser className="mr-2 text-indigo-600" />
                    Ism
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ismingiz"
                    />
                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div> */}

                {/* Last Name Field */}
                {/* <div className="space-y-1">
                  <label
                    htmlFor="last_name"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <FiUser className="mr-2 text-indigo-600" />
                    Familiya
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Familiyangiz"
                    />
                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div> */}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
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
