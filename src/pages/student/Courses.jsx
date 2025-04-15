import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api, { fetchCourses } from "../../api/courses";
import CourseCard from "../../components/CourseCard";

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

        const coursesWithLessons = await Promise.all(
          response.data.map(async (item) => {
            const data = await api.get(
              `https://akkanat.pythonanywhere.com/api/courses/${item.id}/lessons/`
            );

            return {
              description: item.description,
              id: item.id,
              image: item.image,
              instructor: item.instructor,
              title: item.title,
              lessons: data.data.lessons,
            };
          })
        );

        console.log(coursesWithLessons);
        setCourses(coursesWithLessons);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetcher();
  }, [dispatch, user?.id]);

  const handleCourseClick = (course) => {
    // Agar obuna bo'lgan bo'lsa, kurs ichiga kirish
    if (subscribedCourses.some((c) => c.id === course.id)) {
      navigate(`/student/courses/${course.id}/`);
    } else {
      // Aks holda modal ochish
      setSelectedCourse(course);
      setShowModal(true);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Barcha kurslar</h1>
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
