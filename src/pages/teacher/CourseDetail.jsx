import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCourseMaterials, deleteLesson } from "../../api/courses";
import { toast } from "react-hot-toast";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiArrowLeft,
  FiVideo,
  FiFileText,
  FiFile,
  FiMusic,
  FiAlertTriangle,
} from "react-icons/fi";

const TeacherCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseMaterials(id);
        setCourse(data);
      } catch (error) {
        toast.error("Kurs ma'lumotlarini yuklashda xatolik");
        console.error("Xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [id]);

  const confirmDelete = (lessonId) => {
    setLessonToDelete(lessonId);
  };

  const cancelDelete = () => {
    setLessonToDelete(null);
  };

  const handleDeleteLesson = async () => {
    if (!lessonToDelete) return;

    try {
      setDeleting(true);
      await deleteLesson(lessonToDelete);
      setCourse((prev) => ({
        ...prev,
        lessons: prev.lessons.filter((lesson) => lesson.id !== lessonToDelete),
      }));
      toast.success("Dars muvaffaqiyatli o'chirildi");
    } catch (error) {
      toast.error("Darsni o'chirishda xatolik");
      console.error("Xatolik:", error);
    } finally {
      setDeleting(false);
      setLessonToDelete(null);
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <FiFileText className="text-red-500" />;
      case "mp3":
      case "wav":
        return <FiMusic className="text-blue-500" />;
      case "docx":
      case "doc":
        return <FiFile className="text-blue-600" />;
      case "pptx":
      case "ppt":
        return <FiFile className="text-orange-500" />;
      default:
        return <FiFile className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 text-center">
        <p>Kurs topilmadi</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Orqaga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Orqaga qaytish tugmasi */}

      {/* Kurs sarlavhasi va tahrirlash */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
          <p className="text-gray-600 mt-1">{course.description}</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Link
            to={`/teacher/courses/${course.id}/edit`}
            className="flex items-center bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <FiEdit className="mr-1" />
            Kursni tahrirlash
          </Link>
        </div>
      </div>

      {/* Darslar qismi */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-xl font-semibold mb-4 sm:mb-0">Darslar</h2>
          <Link
            to={`/teacher/lessons/${course.id}/create`}
            className="flex items-center bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <FiPlus className="mr-1" />
            Yangi dars qo'shish
          </Link>
        </div>

        {course.lessons?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Hozircha darslar mavjud emas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {course.lessons?.map((lesson) => (
              <div
                key={lesson.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg">{lesson.title}</h3>
                    </div>
                    <p className="text-gray-600 mt-2">{lesson.content}</p>

                    {/* Video linki */}
                    {lesson.video_url && (
                      <div className="mt-3">
                        <a
                          href={lesson.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <FiVideo className="mr-1" />
                          Video darsni ko'rish
                        </a>
                      </div>
                    )}

                    {/* Qo'shimcha fayllar */}
                    {lesson.attachments?.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">
                          Qo'shimcha materiallar:
                        </h4>
                        <div className="space-y-2">
                          {lesson.attachments.map((file) => (
                            <div key={file.id} className="flex items-center">
                              {getFileIcon(file.file)}
                              <a
                                href={`https://akkanat.pythonanywhere.com${file.file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-sm text-gray-700 hover:underline truncate max-w-xs"
                              >
                                {file.file.split("/").pop()}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tahrirlash va o'chirish tugmalari */}
                  <div className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                    <Link
                      to={`/teacher/lessons/${lesson.id}/edit`}
                      className="flex items-center justify-center p-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                      title="Tahrirlash"
                    >
                      <FiEdit />
                    </Link>
                    <button
                      onClick={() => confirmDelete(lesson.id)}
                      className="flex items-center justify-center p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      title="O'chirish"
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

      {/* Darsni o'chirish tasdiq modali */}
      {lessonToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FiAlertTriangle className="text-red-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Darsni o'chirish</h3>
                <p className="text-gray-600">
                  Rostan ham bu darsni o'chirmoqchimisiz? Bu amalni qaytarib
                  bo'lmaydi.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md"
                disabled={deleting}
              >
                Bekor qilish
              </button>
              <button
                onClick={handleDeleteLesson}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? "O'chirilmoqda..." : "O'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCourseDetail;
