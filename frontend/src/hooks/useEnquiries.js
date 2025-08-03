import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const useEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all enquiries (admin only)
  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/enquiries");
      setEnquiries(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to fetch enquiries"
      );
      console.error("Error fetching enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new enquiry
  const createEnquiry = async (enquiryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/enquiries", enquiryData);
      // Add the new enquiry to the list if we have enquiries loaded
      if (enquiries.length > 0) {
        setEnquiries((prev) => [response.data, ...prev]);
      }
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to submit enquiry";
      setError(errorMessage);
      console.error("Error creating enquiry:", err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete enquiry (admin only)
  const deleteEnquiry = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/enquiries/${id}`);
      setEnquiries((prev) => prev.filter((enquiry) => enquiry.id !== id));
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to delete enquiry";
      setError(errorMessage);
      console.error("Error deleting enquiry:", err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    enquiries,
    loading,
    error,
    fetchEnquiries,
    createEnquiry,
    deleteEnquiry,
    refetch: fetchEnquiries,
  };
};

export default useEnquiries;
