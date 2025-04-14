// src/pages/teacher/EditCourse.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { editCourse } from "../../slices/courseSlice";
import { toast } from "react-hot-toast";

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.courses);
  const { accessToken } = useSelector((state) => state.auth);

  const currentCourse = courses.find(
    (course) => course.id === parseInt(courseId)
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (currentCourse) {
      setFormData({
        title: currentCourse.title,
        description: currentCourse.description,
      });
    }
  }, [currentCourse]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        editCourse({
          courseId,
          courseData: formData,
          token: accessToken,
        })
      ).unwrap();
      toast.success("Course updated successfully");
      navigate(`/teacher/courses/${courseId}`);
    } catch (error) {
      toast.error(error.message || "Failed to update course");
    }
  };

  if (!currentCourse) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Course</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            rows="4"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditCourse;
