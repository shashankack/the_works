import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const API_URL = "/addons";

const useAddons = () => {
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all addons
  const fetchAddons = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_URL);
      setAddons(res.data);
      setError(null);
    } catch (e) {
      setError(e.response?.data?.error || e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddons();
  }, []);

  // Add a new addon
  const addAddon = async (addon) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(API_URL, addon);
      setAddons((prev) => [...prev, res.data]);
      setError(null);
    } catch (e) {
      setError(e.response?.data?.error || e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Update an addon
  const updateAddon = async (id, updated) => {
    setLoading(true);
    try {
      const res = await axiosInstance.put(`${API_URL}/${id}`, updated);
      setAddons((prev) => prev.map((a) => (a.id === id ? res.data : a)));
      setError(null);
    } catch (e) {
      setError(e.response?.data?.error || e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Deactivate (soft delete) an addon - toggle active status
  const toggleActiveAddon = async (id, isActive) => {
    setLoading(true);
    try {
      await axiosInstance.patch(`${API_URL}/${id}/active`, { isActive });
      setAddons((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isActive } : a))
      );
      setError(null);
    } catch (e) {
      setError(e.response?.data?.error || e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Hard delete an addon
  const deleteAddon = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`${API_URL}/${id}`);
      setAddons((prev) => prev.filter((a) => a.id !== id));
      setError(null);
    } catch (e) {
      setError(e.response?.data?.error || e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return {
    addons,
    loading,
    error,
    fetchAddons,
    addAddon,
    updateAddon,
    toggleActiveAddon,
    deleteAddon,
  };
};

export default useAddons;
