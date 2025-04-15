import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api, {
  createCourse,
  fetchTeacherCourses,
  getCourseMaterials,
} from "../../api/courses";
import CourseCard from "../../components/CourseCard";
import { toast } from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import CourseSubscribeModal from "../../components/CourseSubscribeModal";

const TeacherCourses = () => {
  const { subscribedCourses } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          "https://akkanat.pythonanywhere.com/api/courses/list/"
        );
        const teacherCourses = response.data.filter(
          (c) => c.instructor.id === user.id
        );

        // Har bir kurs uchun lessonslarni olish
        const coursesWithLessons = await Promise.all(
          teacherCourses.map(async (course) => {
            const lessons = await getCourseMaterials(course.id);
            return { ...course, lessons };
          })
        );

        setCourses(coursesWithLessons);
      } catch (error) {
        console.error("Xatolik:", error);
        toast.error("Kurslarni olishda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, [user?.id]);

  const handleCourseClick = (course) => {
    if (subscribedCourses.some((c) => c.id === course.id)) {
      navigate(`/student/courses/${course.id}`);
    } else {
      setSelectedCourse(course);
      setShowModal(true);
    }
  };

  const changeFile = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setFile(file);
    setThumbnail(url);
  };

  const createHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("image", file);
      formData.append("instructorId", user.id);

      const data = await createCourse(formData, localStorage.getItem("access"));
      if (!data) {
        return toast.error("Kurs yaratishda xatolik yuz berdi");
      }

      const updatedCourses = await fetchTeacherCourses(user.id);
      setCourses(updatedCourses);
      setCreateModal(false);
      setFile(null);
      setThumbnail(null);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(error);
      toast.error("Kurs yaratishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {createModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0000003d] bg-opacity-30 z-50">
          <form
            onSubmit={createHandler}
            className="bg-white w-[90%] md:w-[600px] rounded-lg p-6 shadow-md"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Yangi kurs yaratish
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Kurs nomi
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Kurs haqida
                </label>
                <textarea
                  rows={3}
                  className="w-full border rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Kurs rasmi
                </label>
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="image"
                    className="cursor-pointer w-32 h-24 flex items-center justify-center border rounded-md overflow-hidden bg-gray-50"
                  >
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt="Kurs rasmi"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">Rasm tanlang</span>
                    )}
                  </label>
                  <input
                    type="file"
                    id="image"
                    className="hidden"
                    onChange={changeFile}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={() => setCreateModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                {loading ? "Yaratilmoqda..." : "Yaratish"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mening kurslarim</h1>
          <button
            onClick={() => setCreateModal(true)}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <FiPlus className="mr-2" />
            Yangi kurs
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={handleCourseClick}
                isTeacher
              />
            ))
          ) : (
            <p className="text-gray-500">Hech qanday kurs topilmadi...</p>
          )}
        </div>

        {showModal && selectedCourse && (
          <CourseSubscribeModal
            courseId={selectedCourse.id}
            course={selectedCourse}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default TeacherCourses;
