import axiosInstance from "./axiosInstance";

export const createClass = async (data) => {
  return axiosInstance.post("/classes", data);
};

export const updateClass = async (id, data) => {
  return axiosInstance.put(`/classes/${id}`, data);
};

export const deleteClass = async (id) => {
  return axiosInstance.delete(`/classes/${id}`);
};

export const getClassById = async (id) => {
  return axiosInstance.get(`/classes/${id}`);
};

export const getAllClasses = async (params) => {
  return axiosInstance.get("/classes", { params });
};
