import { useCachedApi } from "./useCachedApi";
import { getAllClasses } from "../api/classService";

export const useClasses = (options = {}) => {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes default cache
    immediate = true,
    ...restOptions
  } = options;

  const {
    data: classes,
    loading,
    error,
    fetchData,
    refresh,
    updateCachedData,
    clearCache,
    isStale,
    isCached
  } = useCachedApi(
    'classes',
    async () => {
      const response = await getAllClasses();
      return response.data;
    },
    {
      ttl,
      immediate,
      ...restOptions
    }
  );

  return { 
    classes: classes || [], 
    loading, 
    error, 
    refetch: refresh,
    fetchClasses: fetchData,
    updateClasses: updateCachedData,
    clearClassesCache: clearCache,
    isStale,
    isCached
  };
};

export default useClasses;
