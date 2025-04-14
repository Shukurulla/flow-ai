import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCourseMaterials } from "../../api/courses";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

const TeacherCourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await getCourseMaterials(courseId);
        setCourse(data);
      } catch (error) {
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [courseId]);

  const handleDeleteLesson = (lessonId) => {
    // Implement delete functionality
    toast.success("Lesson deleted successfully");
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!course) {
    return <div className="p-6">Course not found</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
        <div className="flex space-x-2">
          <Link
            to={`/teacher/courses/${course.id}/edit`}
            className="flex items-center bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition"
          >
            <FiEdit className="mr-1" />
            Edit Course
          </Link>
        </div>
      </div>

      <p className="text-gray-700 mb-6">{course.description}</p>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Lessons</h2>
          <Link
            to={`/teacher/courses/${course.id}/lessons/new`}
            className="flex items-center bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
          >
            <FiPlus className="mr-1" />
            Add Lesson
          </Link>
        </div>

        {course.lessons.length === 0 ? (
          <p className="text-gray-500">No lessons yet</p>
        ) : (
          <div className="space-y-4">
            {course.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{lesson.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {lesson.content}
                    </p>
                    {lesson.video_url && (
                      <a
                        href={lesson.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Watch Video
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/teacher/lessons/${lesson.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <FiEdit />
                    </Link>
                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCourseDetail;
