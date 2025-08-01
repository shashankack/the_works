import { useState, useEffect } from "react";
import { getUserById } from "../api/userService";

export const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async (id) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const userData = await getUserById(id);
      setUser(userData);
    } catch (err) {
      setError(err.message || "Failed to fetch user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

  return { user, loading, error, refetch: () => fetchUser(userId) };
};

export const useUsers = () => {
  const [users, setUsers] = useState({});
  const [loadingUsers, setLoadingUsers] = useState({});
  const [errors, setErrors] = useState({});

  const fetchUser = async (userId) => {
    if (!userId || users[userId]) return users[userId];

    setLoadingUsers(prev => ({ ...prev, [userId]: true }));
    setErrors(prev => ({ ...prev, [userId]: null }));

    try {
      const userData = await getUserById(userId);
      setUsers(prev => ({ ...prev, [userId]: userData }));
      return userData;
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch user";
      setErrors(prev => ({ ...prev, [userId]: errorMessage }));
      return null;
    } finally {
      setLoadingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  return { 
    users, 
    loadingUsers, 
    errors, 
    fetchUser 
  };
};
