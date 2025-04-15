import { useState } from "react";

import { toast } from "react-hot-toast";
import api from "../api/courses";
import { useDispatch } from "react-redux";
import { subscribeToCourse } from "../slices/courseSlice";
import { useNavigate } from "react-router-dom";

const CourseSubscribeModal = ({ course, onClose, courseId }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    try {
      await dispatch(subscribeToCourse(course.id)).unwrap();
      toast.success("Kursga muvaffaqiyatli obuna bo'ldingiz!");
      navigate(`/student/courses/${course.id}`);
      onClose();
    } catch (error) {
      toast.error(error.message || "Xatolik yuz berdi");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4 text-black">
          Kursga A'zo Bo'lish
        </h3>
        <p className="mb-6 text-black">
          Ushbu kursni ko'rish uchun a'zo bo'lishingiz kerak.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-black border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Bekor qilish
          </button>
          <button
            onClick={() => handleSubscribe()}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Jarayonda..." : "A'zo bo'lish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseSubscribeModal;
