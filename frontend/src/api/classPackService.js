import axiosInstance from "./axiosInstance";

export const createClassPack = (data) =>
  axiosInstance.post("/class-packs", data);

export const getClassPacks = () => axiosInstance.get("/class-packs");

export const getPacksByClassId = (classId) =>
  axiosInstance.get(`/class-packs?classId=${classId}`);

export const updateClassPack = (id, data) =>
  axiosInstance.patch(`/class-packs/${id}`, data);

export const deleteClassPack = (id) =>
  axiosInstance.delete(`/class-packs/${id}`);
