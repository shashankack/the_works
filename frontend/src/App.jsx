import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense } from "react";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import { getToken, isAdmin, isAuthenticated } from "./utils/auth";
import { CacheProvider } from "./context/CacheContext";

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
import EnquiriesManagePage from "./pages/Admin/EnquiriesManagePage";

const App = () => {
  return (
    <CacheProvider>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
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
                element={<EnquiriesManagePage />}
              />
            </Route>

            <Route path="/login" element={<AuthPage />} />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentPageWrapper />
                </ProtectedRoute>
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
    </CacheProvider>
  );
};

export default App;
