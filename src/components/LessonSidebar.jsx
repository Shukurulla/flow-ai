import { useNavigate } from "react-router-dom";

const LessonSidebar = ({ lessons, currentLesson, onSelectLesson }) => {
  const path = window.location.pathname.slice(
    0,
    window.location.pathname.length - 2
  );
  console.log(path);

  const navigate = useNavigate();
  const redirect = (lesson) => {
    onSelectLesson(lesson);
    navigate(path + lesson.id);
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="font-semibold mb-4 text-lg">Darslar</h2>
      <div className="space-y-2">
        {lessons?.map((lesson, idx) => (
          <button
            key={lesson.id}
            onClick={() => redirect(lesson)}
            className={`w-full text-left p-2 rounded ${
              currentLesson?.id === lesson.id
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            {idx + 1}. {lesson.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LessonSidebar;
