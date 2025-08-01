import { useCachedApi } from "./useCachedApi";
import axiosInstance from "../api/axiosInstance";

export const useCachedTrainers = (options = {}) => {
  const {
    ttl = 10 * 60 * 1000, // 10 minutes for trainer data
    immediate = true,
    adminMode = false, // Whether to fetch admin data with contact info
    ...restOptions
  } = options;

  const cacheKey = adminMode ? 'trainers_admin' : 'trainers_public';
  const endpoint = adminMode ? '/trainers/admin/' : '/trainers';

  const {
    data: trainers,
    loading,
    error,
    fetchData,
    refresh,
    updateCachedData,
    clearCache,
    isStale,
    isCached
  } = useCachedApi(
    cacheKey,
    async () => {
      const response = await axiosInstance.get(endpoint);
      return response.data;
    },
    {
      ttl,
      immediate,
      ...restOptions
    }
  );

  return { 
    trainers: trainers || [], 
    loading, 
    error, 
    refetch: refresh,
    fetchTrainers: fetchData,
    updateTrainers: updateCachedData,
    clearTrainersCache: clearCache,
    isStale,
    isCached
  };
};

export default useCachedTrainers;
