import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCourseMaterials } from "../../api/courses";
import VideoPlayer from "../../components/VideoPlayer";
import LessonSidebar from "../../components/LessonSidebar";
import { toast } from "react-hot-toast";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await getCourseMaterials(id);
        console.log(data);

        setCourse(data);
        if (data.lessons.length > 0) {
          setCurrentLesson(data.lessons[0]);
        }
      } catch (error) {
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!course) {
    return <div className="p-6">Course not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{course.title}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="lg:w-3/4">
          {currentLesson && (
            <>
              <VideoPlayer url={currentLesson.video_url} />
              <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  {currentLesson.title}
                </h2>
                <p className="text-gray-700">{currentLesson.content}</p>

                {currentLesson.attachment && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Attachments</h3>
                    <a
                      href={`https://akkanat.pythonanywhere.com${currentLesson.attachment.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      Download File
                    </a>
                  </div>
                )}

                {/* Comments Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Comments</h3>
                  <div className="space-y-4">
                    {/* Sample comments - replace with real data */}
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600">S</span>
                      </div>
                      <div>
                        <p className="font-medium">Student 1</p>
                        <p className="text-gray-600">
                          This lesson was very helpful!
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600">T</span>
                      </div>
                      <div>
                        <p className="font-medium">Teacher</p>
                        <p className="text-gray-600">
                          Glad you found it useful!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Lessons Sidebar */}
        <div className="lg:w-1/4">
          <LessonSidebar
            lessons={course.lessons}
            currentLesson={currentLesson}
            onSelectLesson={setCurrentLesson}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
