import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense } from "react";
import Loader from "./components/Loader";
import { getToken } from "./utils/auth";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Main Pages
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import ActivityInternal from "./pages/ActivityInternal";
import PaymentPageWrapper from "./pages/PaymentPageWrapper";

// Admin Pages
import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import ActivitesManagePage from "./pages/Admin/ActivitesManagePage";
import TrainersManagePage from "./pages/Admin/TrainersManagePage";
import BookingsManagePage from "./pages/Admin/BookingsManagePage";

const ProtectedRoutes = ({ children }) => {
  const token = getToken();
  return token ? children : <Navigate to="/admin/login" replace />;
};

const UserProtectedRoutes = ({ children }) => {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoutes>
                <AdminLayout />
              </ProtectedRoutes>
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route
              path="/admin/manage-activities"
              element={<ActivitesManagePage />}
            />
            <Route path="/admin/trainers" element={<TrainersManagePage />} />
            <Route path="/admin/bookings" element={<BookingsManagePage />} />
            <Route
              path="/admin/enquiries"
              element={<div>Manage Enquiries</div>}
            />
          </Route>

          <Route path="/login" element={<AuthPage />} />
          <Route
            path="/payment"
            element={
              <UserProtectedRoutes>
                <PaymentPageWrapper />
              </UserProtectedRoutes>
            }
          />

          {/* Main Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/activity/:id" element={<ActivityInternal />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
