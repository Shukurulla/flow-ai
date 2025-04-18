import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import TeacherLayout from "./components/layout/TeacherLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import StudentLayout from "./components/layout/StudentLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentCourses from "./pages/student/Courses";
import CourseDetail from "./pages/student/CourseDetail";
import Profile from "./pages/Profile";
import TeacherCourses from "./pages/teacher/Courses";
import TeacherCourseDetail from "./pages/teacher/CourseDetail";
import SavedCourses from "./pages/student/SavedCourses";
import EditLesson from "./pages/teacher/EditLesson";
import EditCoursePage from "./pages/teacher/EditCourse";
import CreateLesson from "./pages/teacher/createLesson";
function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "sans-serif",
          },
          success: {
            className: "border-l-4 border-green-500",
          },
          error: {
            className: "border-l-4 border-red-500",
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute roles={["student"]} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route path="courses" element={<StudentCourses />} />
            <Route
              path="courses/:courseId/:lessonId"
              element={<CourseDetail />}
            />
            <Route path="saved" element={<SavedCourses />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={["teacher"]} />}>
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<TeacherCourses />} />
            <Route path="courses/:id" element={<TeacherCourseDetail />} />
            <Route path="courses/:id/edit" element={<EditCoursePage />} />
            <Route path="lessons/:id/edit" element={<EditLesson />} />
            <Route path="profile" element={<Profile />} />
            <Route path="lessons/:id/create" element={<CreateLesson />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
