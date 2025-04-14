const LessonSidebar = ({ lessons, currentLesson, onSelectLesson }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="font-semibold mb-4 text-lg">Lessons</h2>
      <div className="space-y-2">
        {lessons?.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => onSelectLesson(lesson)}
            className={`w-full text-left p-2 rounded ${
              currentLesson?.id === lesson.id
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            {lesson.order}. {lesson.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LessonSidebar;
