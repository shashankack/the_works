import axiosInstance from "./axiosInstance";

export const createSchedule = (data) =>
  axiosInstance.post("/class-schedules", data);

export const getClassSchedules = () => axiosInstance.get("/class-schedules");

export const getSchedulesByClassId = (classId) =>
  axiosInstance.get(`/class-schedules?classId=${classId}`);

export const updateSchedule = (id, data) =>
  axiosInstance.patch(`/class-schedules/${id}`, data);

export const deleteSchedule = (id) =>
  axiosInstance.delete(`/class-schedules/${id}`);
