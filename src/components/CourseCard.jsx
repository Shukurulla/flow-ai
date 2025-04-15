import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../api/courses";
import { FiBook, FiUser, FiArrowRight, FiLoader } from "react-icons/fi";
import { RiBook2Line } from "react-icons/ri";

const CourseCard = ({ course, onClick, isTeacher, lessonsCount }) => {
  const { user } = useSelector((state) => state.auth);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const response = await api.get(`/${course.id}/`);
        const subscribed = response.data.students?.some(
          (student) => student.id === user.id
        );
        setIsSubscribed(subscribed);
      } catch (error) {
        console.error("Obuna holatini tekshirishda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [course.id, user?.id]);

  const handleImageError = () => {
    setImageError(true);
  };

  // Linkni generatsiya qilish funksiyasi
  const generateCourseLink = () => {
    if (isTeacher) {
      return `/teacher/courses/${course.id}`;
    } else if (user?.role === "student") {
      return `/student/courses/${course.id}/${course?.lessons?.[0]?.id || "1"}`;
    } else {
      return "#";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Kurs rasmi */}
      <div className="relative h-48 bg-gray-100 flex items-center justify-center">
        {imageError || !course.image ? (
          <div className="text-gray-300 flex flex-col items-center">
            <RiBook2Line size={64} />
            <span className="mt-2 text-sm">Rasm mavjud emas</span>
          </div>
        ) : (
          <img
            src={`https://akkanat.pythonanywhere.com${course.image}`}
            className="w-full h-full object-cover"
            alt={course.title}
            onError={handleImageError}
          />
        )}
        {isTeacher && (
          <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            Sizning kursingiz
          </div>
        )}
      </div>

      {/* Kurs kontenti */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
            {course.title}
          </h3>
          {lessonsCount !== undefined && (
            <span className="flex items-center text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              <FiBook className="mr-1" size={14} />
              {lessonsCount} dars
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description || "Tavsif mavjud emas"}
        </p>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <FiUser className="text-gray-400 mr-1" size={16} />
            <span className="text-sm text-gray-500">
              {course.instructor?.username || "Noma'lum o'qituvchi"}
            </span>
          </div>

          {isSubscribed || isTeacher || user?.role === "student" ? (
            <Link
              to={generateCourseLink()}
              className="flex items-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-lg transition-colors"
            >
              Kirish <FiArrowRight className="ml-1" size={16} />
            </Link>
          ) : (
            <button
              onClick={onClick}
              disabled={loading}
              className={`flex items-center text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                loading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin mr-1" size={16} />
                  Tekshirilmoqda...
                </>
              ) : (
                "Obuna bo'lish"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
