import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTeacherCourses } from "../../api/courses";
import CourseCard from "../../components/CourseCard";
import { setCourses } from "../../slices/courseSlice";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

const TeacherCourses = () => {
  const { courses } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchTeacherCourses(user.id);
        console.log(data);

        dispatch(setCourses(data));
      } catch (error) {
        console.log(error);

        toast.error("Failed to load courses");
      }
    };
    loadCourses();
  }, [dispatch, user.id]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
        <Link
          to="/teacher/courses/new"
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <FiPlus className="mr-2" />
          New Course
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} isTeacher />
        ))}
      </div>
    </div>
  );
};

export default TeacherCourses;
