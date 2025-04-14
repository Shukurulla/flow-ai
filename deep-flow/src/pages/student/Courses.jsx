import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api, { fetchCourses } from "../../api/courses";
import CourseCard from "../../components/CourseCard";
import {
  loadCourses,
  checkSubscriptions,
  setCourses,
} from "../../slices/courseSlice";
import { toast } from "react-hot-toast";
import CourseSubscribeModal from "../../components/CourseSubscribeModal";

const StudentCourses = () => {
  const { subscribedCourses } = useSelector((state) => state.courses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const [courses, setCourses] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const response = await api.get(
          `https://akkanat.pythonanywhere.com/api/courses/list/`
        );
        console.log(response);

        setCourses(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    };
    fetcher();
  }, [dispatch, user?.id]);

  const handleCourseClick = (course) => {
    // Agar obuna bo'lgan bo'lsa, kurs ichiga kirish
    if (subscribedCourses.some((c) => c.id === course.id)) {
      navigate(`/student/courses/${course.id}`);
    } else {
      // Aks holda modal ochish
      setSelectedCourse(course);
      setShowModal(true);
    }
  };
  console.log(courses);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">All Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isSubscribed={subscribedCourses.some((c) => c.id === course.id)}
            onClick={() => handleCourseClick(course)}
          />
        ))}
      </div>

      {showModal && selectedCourse && (
        <CourseSubscribeModal
          courseId={selectedCourse.id}
          course={selectedCourse}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default StudentCourses;
