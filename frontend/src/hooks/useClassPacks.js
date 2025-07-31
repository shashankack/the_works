import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const useClassPacks = () => {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPacks = async () => {
    try {
      const res = await axiosInstance.get("/class-packs");
      setPacks(res.data);
    } catch (err) {
      setError("Failed to load class packs");
    } finally {
      setLoading(false);
    }
  };

  const addPack = async (pack) => {
    const res = await axiosInstance.post("/class-packs", pack);
    fetchPacks();
    return res.data;
  };

  const updatePack = async (id, updates) => {
    const res = await axiosInstance.put(`/class-packs/${id}`, updates);
    fetchPacks();
    return res.data;
  };

  const deactivatePack = async (id) => {
    const res = await axiosInstance.delete(`/class-packs/${id}`);
    fetchPacks();
    return res.data;
  };

  const toggleActivePack = async (id, isActive) => {
    const res = await axiosInstance.patch(`/class-packs/${id}/active`, {
      isActive,
    });
    fetchPacks();
    return res.data;
  };

  useEffect(() => {
    fetchPacks(); // fetch all globally
  }, []);

  return {
    packs,
    loading,
    error,
    addPack,
    updatePack,
    deactivatePack,
    toggleActivePack,
    refetch: fetchPacks,
  };
};

export default useClassPacks;
