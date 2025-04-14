import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api/courses";
import { Link } from "react-router-dom";

const CourseCard = ({ course, onClick }) => {
  const { user } = useSelector((state) => state.auth);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <h3 className="text-lg font-semibold">{course.title}</h3>
        <p className="text-gray-600 text-sm mt-2">{course.description}</p>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {course.instructor?.username || "O'qituvchi ko'rsatilmagan"}
          </span>
          {isSubscribed ? (
            <Link
              className=" bg-green-100 text-green-800 px-2 rounded-md hover:bg-green-200"
              to={`/student/courses/${course.id}`}
            >
              Kursni ko'rish
            </Link>
          ) : (
            <button
              onClick={onClick}
              disabled={loading}
              className={`px-3 py-1 rounded-lg text-sm ${
                isSubscribed
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading
                ? "Tekshirilmoqda..."
                : isSubscribed
                ? "Kursni ko'rish"
                : "Obuna bo'lish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
