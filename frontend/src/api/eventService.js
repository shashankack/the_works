import axiosInstance from "../api/axiosInstance";

export const createEvent = (data) => {
  return axiosInstance.post("/events", data);
};

export const updateEvent = (id, data) => {
  return axiosInstance.patch(`/events/${id}`, data);
};

export const deleteEvent = (id) => {
  return axiosInstance.delete(`/events/${id}`);
};

export const getAllEvents = () => {
  return axiosInstance.get("/events");
};

export const getEventById = (id) => {
  return axiosInstance.get(`/events/${id}`);
};
