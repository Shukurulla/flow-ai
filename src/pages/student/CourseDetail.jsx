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
import { useSelector } from "react-redux";

// Modal komponenti
const Modal = ({ isOpen, onClose, title, children, isTyping }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            disabled={isTyping}
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
  const [newMessage, setNewMessage] = useState("");
  const [lessons, setLessons] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [username, setUsername] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [chatLoading, setChatLoading] = useState(false);
  useEffect(() => {
    const loadCourse = async () => {
      try {
        const lessons = await api.get(
          `https://akkanat.pythonanywhere.com/api/courses/${courseId}/lessons/`
        );
        setLessons(lessons.data.lessons);

        const response = await api.get(
          `https://akkanat.pythonanywhere.com/api/lessons/lessons/${lessonId}/`
        );
        console.log(response.data);

        setCourse(response.data);
        setCurrentLesson(response.data);

        // Auth tizimidan username ni olish
        const storedUsername = localStorage.getItem("username") || "user";
        setUsername(storedUsername);
      } catch (error) {
        toast.error("Kurs ma'lumotlarini yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [lessonId]);

  const loadAllChatHistory = async () => {
    setChatLoading(true);
    try {
      let allMessages = [];
      let nextUrl = `https://akkanat.pythonanywhere.com/api/chat/${lessonId}/history/`;

      // Barcha sahifalardagi xabarlarni yig'amiz
      while (nextUrl) {
        const response = await api.get(nextUrl);
        allMessages = [...allMessages, ...response.data.results];
        nextUrl = response.data.next;
      }

      // Faqat joriy foydalanuvchiga tegishli xabarlarni ajratib olamiz
      const filteredMessages = allMessages
        .filter((msg) => msg.username === user.username)
        .map((msg) => ({
          id: msg.id,
          text: msg.message,
          isBot: !msg.is_from_student,
          createdAt: msg.created_at,
        }));

      setChatMessages(filteredMessages);
      setChatLoading(false);
    } catch (error) {
      toast.error("Chat tarixini yuklashda xatolik yuz berdi");
      setChatLoading(false);
      console.error("Chat history error:", error);
    }
  };

  const handleFileClick = (fileUrl) => {
    const extension = fileUrl.split(".").pop().toLowerCase();
    if (extension === "pdf") {
      setCurrentPdf(fileUrl);
      setShowPdfModal(true);
    }
  };

  const startChat = async () => {
    setShowChatModal(true);
    await loadAllChatHistory();
  };

  const simulateTyping = async (responseText) => {
    setIsTyping(true);
    let displayedText = "";

    for (let i = 0; i < responseText.length; i++) {
      displayedText += responseText[i];
      setChatMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.isTyping) {
          return [
            ...prev.slice(0, -1),
            {
              ...lastMessage,
              text: displayedText,
            },
          ];
        }
        return prev;
      });
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    setIsTyping(false);
    setChatMessages((prev) => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage.isTyping) {
        return [
          ...prev.slice(0, -1),
          {
            ...lastMessage,
            isTyping: false,
          },
        ];
      }
      return prev;
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    // Foydalanuvchi xabarini darhol qo'shamiz
    const userMessage = {
      id: Date.now(),
      text: newMessage,
      isBot: false,
      createdAt: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    try {
      // APIga xabar yuboramiz
      const response = await api.post(
        `https://akkanat.pythonanywhere.com/api/chat/${lessonId}/send-message/`,
        { message: newMessage }
      );

      // Bot javobini typing effekti bilan qo'shamiz
      const botMessage = {
        id: Date.now() + 1,
        text: "",
        isBot: true,
        isTyping: true,
      };

      setChatMessages((prev) => [...prev, botMessage]);
      await simulateTyping(response.data.response);
    } catch (error) {
      toast.error("Xabar yuborishda xatolik yuz berdi");
      // Xatolik xabarini qo'shamiz
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Xabar yuborishda xatolik yuz berdi. Iltimos, keyinroq urunib ko'ring.",
          isBot: true,
        },
      ]);
    }
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
        isTyping={isTyping}
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
        isTyping={isTyping}
        onClose={() => setShowChatModal(false)}
        title="Suhbat"
      >
        {chatLoading ? (
          <div className="pb-5">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="h-[60vh] overflow-y-auto mb-4 space-y-3 px-2">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>Suhbatni boshlang</p>
                <p>
                  Darsga oid har qanday savolingiz bo'lsa yozishingiz mumkin
                </p>
              </div>
            ) : (
              chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[70%] p-3 rounded-xl shadow-sm text-sm ${
                    message.isBot
                      ? "bg-[#e2f5e9] text-gray-800 self-start mr-auto"
                      : "bg-[#dbeafe] text-gray-800 self-end ml-auto"
                  }`}
                >
                  <p>{message.text}</p>
                  {message.isTyping && (
                    <div className="flex space-x-1 mt-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        <div className="flex border-t pt-3 px-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Xabaringizni yozing..."
            className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 disabled:bg-blue-400"
            disabled={isTyping || !newMessage.trim()}
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
          title="Suhbat"
        >
          <FiMessageSquare size={24} />
        </button>
      </div>
    </div>
  );
};

export default CourseDetail;
