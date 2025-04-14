import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
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
import EditCourse from "./pages/teacher/EditCourse";
import EditLesson from "./pages/teacher/EditLesson";
import { store } from "./store/store";
function App() {
  return (
    <Provider store={store}>
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
              <Route path="courses/:id" element={<CourseDetail />} />
              <Route path="saved" element={<SavedCourses />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={["teacher"]} />}>
            <Route path="/teacher" element={<TeacherLayout />}>
              <Route index element={<TeacherCourses />} />
              <Route path="courses/:id" element={<TeacherCourseDetail />} />
              <Route path="courses/:id/edit" element={<EditCourse />} />
              <Route path="lessons/:id/edit" element={<EditLesson />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
