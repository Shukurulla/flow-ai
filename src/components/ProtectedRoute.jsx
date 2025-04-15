import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../api/auth";
import { updateProfile } from "../slices/authSlice";

const ProtectedRoute = ({ roles }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("access");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile(); // token headerga qo‘shilishi kerak (axios interceptors)
        dispatch(updateProfile(profile));
      } catch (err) {
        console.error("Profile fetch error:", err);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      } finally {
        setLoading(false);
      }
    };

    if (!user && accessToken) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [accessToken, user, dispatch]);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div>Loading...</div>; // yoki spinner
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
