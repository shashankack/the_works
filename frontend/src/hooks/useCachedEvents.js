import { useCachedApi } from "./useCachedApi";
import axiosInstance from "../api/axiosInstance";

export const useCachedEvents = (options = {}) => {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes default cache
    immediate = true,
    ...restOptions
  } = options;

  const {
    data: events,
    loading,
    error,
    fetchData,
    refresh,
    updateCachedData,
    clearCache,
    isStale,
    isCached
  } = useCachedApi(
    'events',
    async () => {
      const response = await axiosInstance.get('/events');
      return response.data;
    },
    {
      ttl,
      immediate,
      ...restOptions
    }
  );

  return { 
    events: events || [], 
    loading, 
    error, 
    refetch: refresh,
    fetchEvents: fetchData,
    updateEvents: updateCachedData,
    clearEventsCache: clearCache,
    isStale,
    isCached
  };
};

export default useCachedEvents;
