import { useCachedApi } from "./useCachedApi";
import { getAllEvents } from "../api/eventService";

export const useEvents = (options = {}) => {
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
      const response = await getAllEvents();
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
