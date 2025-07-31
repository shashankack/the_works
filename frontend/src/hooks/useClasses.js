import { useEffect, useState } from "react";
import { getAllClasses } from "../api/classService";

export const useClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await getAllClasses();
      setClasses(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return { classes, loading, error, refetch: fetchClasses };
};
