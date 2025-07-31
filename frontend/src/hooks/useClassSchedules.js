import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const useClassSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSchedules = async () => {
    try {
      const res = await axiosInstance.get("/class-schedules/public");
      setSchedules(res.data);
    } catch (err) {
      setError("Failed to load class schedules");
    } finally {
      setLoading(false);
    }
  };

  const addSchedule = async (schedule) => {
    const res = await axiosInstance.post("/class-schedules", schedule);
    fetchSchedules();
    return res.data;
  };

  const updateSchedule = async (id, updates) => {
    const res = await axiosInstance.put(`/class-schedules/${id}`, updates);
    fetchSchedules();
    return res.data;
  };

  const deactivateSchedule = async (id) => {
    const res = await axiosInstance.delete(`/class-schedules/${id}`);
    fetchSchedules();
    return res.data;
  };

  const toggleActiveSchedule = async (id, isActive) => {
    const res = await axiosInstance.patch(`/class-schedules/${id}/active`, {
      isActive,
    });
    fetchSchedules();
    return res.data;
  };

  useEffect(() => {
    fetchSchedules(); // ✅ always fetch globally
  }, []);

  return {
    schedules,
    loading,
    error,
    addSchedule,
    updateSchedule,
    deactivateSchedule,
    toggleActiveSchedule,
    refetch: fetchSchedules,
  };
};

export default useClassSchedules;
