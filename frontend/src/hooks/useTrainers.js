import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const useTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTrainers = async () => {
    try {
      const res = await axiosInstance.get("/trainers");
      setTrainers(res.data);
    } catch (error) {
      setError("Failed to fetch trainers");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainerById = async (id) => {
    try {
      const res = await axiosInstance.get(`/trainers/${id}`);
      return res.data;
    } catch (error) {
      setError("Failed to fetch trainer");
    }
  };

  const addTrainer = async (trainer) => {
    try {
      const res = await axiosInstance.post("/trainers", trainer);
      setTrainers((prev) => [...prev, res.data]);
      return res.data;
    } catch (error) {
      setError("Failed to add trainer");
      throw error;
    }
  };

  const updateTrainer = async (id, updates) => {
    try {
      const res = await axiosInstance.put(`/trainers/${id}`, updates);
      setTrainers((prev) =>
        prev.map((trainer) => (trainer.id === id ? res.data : trainer))
      );
      return res.data;
    } catch (error) {
      setError("Failed to update trainer");
      throw error;
    }
  };

  const deactivateTrainer = async (id) => {
    try {
      await axiosInstance.delete(`/trainers/${id}`);
      setTrainers((prev) => prev.filter((trainer) => trainer.id !== id));
    } catch (error) {
      setError("Failed to deactivate trainer");
      throw error;
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  return {
    trainers,
    loading,
    error,
    fetchTrainers,
    fetchTrainerById,
    addTrainer,
    updateTrainer,
    deactivateTrainer,
  };
};

export default useTrainers;
