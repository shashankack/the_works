import { Outlet } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "../components/Admin/Navbar";
const AdminLayout = () => {
  useEffect(() => {
    document.title = "Admin Dashboard | The Works";
  }, []);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default AdminLayout;
