import { useState, useEffect, useCallback } from 'react';
import { useCache } from '../context/CacheContext';

/**
 * Custom hook for API calls with caching
 * @param {string} cacheKey - Unique key for caching
 * @param {Function} apiCall - Function that returns a promise with the API call
 * @param {Object} options - Configuration options
 * @param {number} options.ttl - Time to live in milliseconds
 * @param {boolean} options.immediate - Whether to call immediately on mount
 * @param {Array} options.dependencies - Dependencies that trigger refetch when changed
 */
export const useCachedApi = (cacheKey, apiCall, options = {}) => {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes default
    immediate = true,
    dependencies = []
  } = options;

  const cache = useCache();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Check if we should use cached data
  const shouldUseCachedData = useCallback(() => {
    const cacheInfo = cache.getCacheInfo(cacheKey);
    return cacheInfo.hasData && !cacheInfo.isExpired;
  }, [cache, cacheKey]);

  // Fetch data function
  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setError(null);

      // Use cached data if available and not forcing refresh
      if (!forceRefresh && shouldUseCachedData()) {
        const cachedData = cache.getCachedData(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setLastFetch(cache.getCacheInfo(cacheKey).timestamp);
          return cachedData;
        }
      }

      setLoading(true);
      const result = await apiCall();
      
      // Cache the result
      cache.setCachedData(cacheKey, result, ttl);
      
      setData(result);
      setLastFetch(Date.now());
      setLoading(false);
      
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      setLoading(false);
      throw err;
    }
  }, [apiCall, cache, cacheKey, ttl, shouldUseCachedData]);

  // Refresh data (force refetch)
  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Clear cache for this key
  const clearCache = useCallback(() => {
    cache.removeCachedData(cacheKey);
    setData(null);
    setLastFetch(null);
  }, [cache, cacheKey]);

  // Invalidate and refetch
  const invalidateAndRefetch = useCallback(() => {
    clearCache();
    return fetchData(true);
  }, [clearCache, fetchData]);

  // Update cached data without API call
  const updateCachedData = useCallback((newData) => {
    cache.setCachedData(cacheKey, newData, ttl);
    setData(newData);
    setLastFetch(Date.now());
  }, [cache, cacheKey, ttl]);

  // Check if data is stale
  const isStale = useCallback(() => {
    const cacheInfo = cache.getCacheInfo(cacheKey);
    return !cacheInfo.hasData || cacheInfo.isExpired;
  }, [cache, cacheKey]);

  // Get cache age
  const getCacheAge = useCallback(() => {
    const cacheInfo = cache.getCacheInfo(cacheKey);
    return cacheInfo.age;
  }, [cache, cacheKey]);

  // Initial data load
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate]); // Only run on mount or when immediate changes

  // Handle dependencies change
  useEffect(() => {
    if (dependencies.length > 0) {
      fetchData(true); // Force refresh when dependencies change
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    lastFetch,
    
    // Actions
    fetchData,
    refresh,
    clearCache,
    invalidateAndRefetch,
    updateCachedData,
    
    // Status checks
    isStale,
    getCacheAge,
    isCached: cache.isCached(cacheKey),
    
    // Cache info
    cacheInfo: cache.getCacheInfo(cacheKey)
  };
};

export default useCachedApi;
