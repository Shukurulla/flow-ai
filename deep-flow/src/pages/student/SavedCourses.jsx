// pages/student/SavedCourses.jsx
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard";

const SavedCourses = () => {
  const { subscribedCourses } = useSelector((state) => state.courses);
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Obuna Bo'lgan Kurslarim</h1>

      {subscribedCourses.length === 0 ? (
        <p className="text-gray-500">
          Hozircha obuna bo'lgan kurslaringiz yo'q
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscribedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isSubscribed={true}
              onClick={() => navigate(`/student/courses/${course.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedCourses;
