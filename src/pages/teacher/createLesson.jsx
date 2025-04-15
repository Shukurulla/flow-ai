import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../api/courses";
import {
  FiUpload,
  FiSave,
  FiLoader,
  FiX,
  FiFile,
  FiFileText,
  FiMusic,
  FiVideo,
} from "react-icons/fi";

const CreateLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    video_url: "",
    order: "",
    attachment_files: [],
  });
  const [files, setFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.order) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("video_url", formData.video_url);
      data.append("order", formData.order);
      data.append("course", id);

      // Fayllarni qo'shish
      files.forEach((file) => {
        data.append("attachment_files", file);
      });

      const response = await api.post(
        "https://akkanat.pythonanywhere.com/api/lessons/lessons/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Dars muvaffaqiyatli yaratildi!");
      navigate(`/teacher/courses/${id}`);
    } catch (error) {
      toast.error("Dars yaratishda xatolik yuz berdi");
      console.error("Yaratishda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">
              Yangi dars yaratish
            </h1>
            <p className="text-gray-600 mt-1">Kurs ID: {id}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Dars nomi *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Dars nomini kiriting"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="order"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tartib raqami *
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Dars tartib raqami"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dars kontenti *
              </label>
              <textarea
                id="content"
                name="content"
                rows={6}
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Dars haqida to'liq ma'lumot"
                required
              />
            </div>

            <div>
              <label
                htmlFor="video_url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Video URL (YouTube yoki boshqa manba)
              </label>
              <div className="flex items-center">
                <FiVideo className="text-gray-400 mr-2" />
                <input
                  type="url"
                  id="video_url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qo'shimcha fayllar
              </label>

              {/* Tanlangan fayllar */}
              {files.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Tanlangan fayllar:
                  </h3>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-blue-50 p-3 rounded-md"
                      >
                        <div className="flex items-center">
                          {getFileIcon(file.name)}
                          <span className="ml-2 text-sm truncate max-w-xs">
                            {file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fayl yuklash */}
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiUpload className="mr-2" />
                Fayl qo'shish
              </label>
              <input
                id="file-upload"
                name="attachment_files"
                type="file"
                multiple
                onChange={handleFileChange}
                className="sr-only"
              />
              <p className="mt-1 text-sm text-gray-500">
                PDF, Word, PowerPoint, Audio va boshqa fayllarni yuklashingiz
                mumkin
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/teacher/courses/${id}`)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Yaratilmoqda...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Darsni yaratish
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLesson;
