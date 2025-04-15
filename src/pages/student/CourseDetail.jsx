import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/courses";
import VideoPlayer from "../../components/VideoPlayer";
import LessonSidebar from "../../components/LessonSidebar";
import { toast } from "react-hot-toast";
import {
  FiDownload,
  FiFile,
  FiMusic,
  FiFileText,
  FiMessageSquare,
  FiX,
} from "react-icons/fi";

// Modal komponenti
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4">{children}</div>
      </div>
    </div>
  );
};

const CourseDetail = () => {
  const { courseId, lessonId } = useParams();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [currentPdf, setCurrentPdf] = useState("");
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const lessons = await api.get(
          `http://akkanat.pythonanywhere.com/api/courses/${courseId}/lessons/`
        );
        setLessons(lessons.data.lessons);

        const response = await api.get(
          `http://akkanat.pythonanywhere.com/api/lessons/lessons/${lessonId}/`
        );
        console.log(response.data);

        setCourse(response.data);
        setCurrentLesson(response.data);
      } catch (error) {
        toast.error("Kurs ma'lumotlarini yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [lessonId]);

  const handleFileClick = (fileUrl) => {
    const extension = fileUrl.split(".").pop().toLowerCase();
    if (extension === "pdf") {
      setCurrentPdf(fileUrl);
      setShowPdfModal(true);
    }
  };

  const startChat = () => {
    setShowChatModal(true);
    if (currentLesson?.questions) {
      const initialMessages = currentLesson.questions.map(
        (question, index) => ({
          id: index,
          text: question,
          isBot: false,
          isQuestion: true,
        })
      );
      setChatMessages(initialMessages);
    }
  };

  const handleSendQuestion = () => {
    if (!newQuestion.trim()) return;

    // Yangi savolni qo'shamiz
    const questionMessage = {
      id: chatMessages.length + 1,
      text: newQuestion,
      isBot: false,
      isQuestion: true,
    };

    setChatMessages([...chatMessages, questionMessage]);
    setNewQuestion("");

    // Simulyatsiya: ChatGPT javobi
    setTimeout(() => {
      const answerMessage = {
        id: chatMessages.length + 2,
        text: `"${newQuestion}" savolingizga javob. ChatGPT tomonidan generatsiya qilingan javob bu yerda ko'rinadi.`,
        isBot: true,
      };
      setChatMessages((prev) => [...prev, answerMessage]);
    }, 1500);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "mp3":
      case "wav":
        return <FiMusic className="text-blue-500" />;
      case "pdf":
        return <FiFileText className="text-red-500" />;
      default:
        return <FiFile className="text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="p-6">Yuklanmoqda...</div>;
  }

  if (!course) {
    return <div className="p-6">Kurs topilmadi</div>;
  }

  return (
    <div className="p-6 pb-20">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{course.title}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Asosiy kontent */}
        <div className="lg:w-3/4">
          {currentLesson && (
            <>
              <VideoPlayer url={currentLesson.video_url} />

              <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  {currentLesson.title}
                </h2>
                <p className="text-gray-700 mb-6">{currentLesson.content}</p>

                {currentLesson.attachments?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">
                      <FiDownload className="inline mr-2" />
                      Qo'shimcha materiallar
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentLesson.attachments.map((file) => {
                        const fileName = file.file.split("/").pop();
                        const isAudio =
                          fileName.endsWith(".mp3") ||
                          fileName.endsWith(".wav");
                        const isPdf = fileName.endsWith(".pdf");

                        return (
                          <div
                            key={file.id}
                            className="border rounded-lg p-4 hover:bg-gray-50 transition"
                          >
                            <div className="flex items-center mb-2">
                              {getFileIcon(fileName)}
                              <span className="ml-2 font-medium truncate">
                                {fileName}
                              </span>
                            </div>

                            {isAudio && (
                              <audio controls className="w-full mt-2">
                                <source
                                  src={file.file}
                                  type={`audio/${fileName.split(".").pop()}`}
                                />
                                Sizning brauzeringiz audio elementini
                                qo'llab-quvvatlamaydi.
                              </audio>
                            )}

                            <div className="mt-2 flex gap-2">
                              <a
                                href={file.file}
                                download
                                className="text-sm text-blue-600 hover:underline flex items-center"
                              >
                                <FiDownload className="inline mr-1" />
                                Yuklab olish
                              </a>

                              {isPdf && (
                                <button
                                  onClick={() => handleFileClick(file.file)}
                                  className="text-sm text-green-600 hover:underline flex items-center"
                                >
                                  <FiFileText className="inline mr-1" />
                                  Ko'rish
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Darslar yon paneli */}
        <div className="lg:w-1/4">
          <LessonSidebar
            lessons={lessons}
            currentLesson={currentLesson}
            onSelectLesson={setCurrentLesson}
          />
        </div>
      </div>

      {/* PDF ko'rish uchun modal */}
      <Modal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        title="PDF ko'rish"
      >
        <div className="h-[70vh]">
          <iframe
            src={`https://docs.google.com/gview?url=${currentPdf}&embedded=true`}
            className="w-full h-full border rounded"
            title="PDF hujjat"
          >
            Sizning brauzeringiz PDF ko'rsatishni qo'llab-quvvatlamaydi.
            <a href={currentPdf} className="text-blue-600">
              {" "}
              Yuklab olish
            </a>{" "}
            uchun bosing.
          </iframe>
        </div>
      </Modal>

      {/* ChatGPT suhbat modal */}
      <Modal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        title="Savol-javob"
      >
        <div className="h-[60vh] overflow-y-auto mb-4 space-y-3 px-2">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[70%] p-3 rounded-xl shadow-sm text-sm ${
                message.isBot
                  ? "bg-[#e2f5e9] text-gray-800 self-start mr-auto"
                  : "bg-[#dbeafe] text-gray-800 self-end ml-auto"
              }`}
            >
              <p>{message.text}</p>

              {message.isQuestion && !message.isBot && (
                <button
                  className="mt-2 text-sm text-blue-600 hover:underline flex items-center"
                  onClick={() => {
                    const answerMessage = {
                      id: chatMessages.length + 1,
                      text: `"${message.text}" savolingizga javob. ChatGPT tomonidan generatsiya qilingan javob bu yerda ko'rinadi.`,
                      isBot: true,
                    };
                    setChatMessages((prev) => [...prev, answerMessage]);
                  }}
                >
                  <FiMessageSquare className="mr-1" />
                  Javob olish
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex border-t pt-3 px-2">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendQuestion()}
            placeholder="Savolingizni yozing..."
            className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleSendQuestion}
            className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
          >
            Yuborish
          </button>
        </div>
      </Modal>

      {/* Chat boshlash tugmasi */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={startChat}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
          title="Savol-javob"
        >
          <FiMessageSquare size={24} />
        </button>
      </div>
    </div>
  );
};

export default CourseDetail;
