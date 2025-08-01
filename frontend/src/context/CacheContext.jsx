import React, { createContext, useContext, useState, useCallback } from 'react';

const CacheContext = createContext();

export const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
};

export const CacheProvider = ({ children }) => {
  const [cacheState, setCacheState] = useState({});

  // Get data from session storage
  const getFromSessionStorage = useCallback((key) => {
    try {
      const item = sessionStorage.getItem(`cache_${key}`);
      if (item) {
        const parsed = JSON.parse(item);
        // Check if data has expired (optional TTL)
        if (parsed.expiry && Date.now() > parsed.expiry) {
          sessionStorage.removeItem(`cache_${key}`);
          return null;
        }
        return parsed.data;
      }
      return null;
    } catch (error) {
      console.error('Error reading from session storage:', error);
      return null;
    }
  }, []);

  // Set data to session storage
  const setToSessionStorage = useCallback((key, data, ttl = null) => {
    try {
      const item = {
        data,
        expiry: ttl ? Date.now() + ttl : null,
        timestamp: Date.now()
      };
      sessionStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.error('Error writing to session storage:', error);
    }
  }, []);

  // Remove from session storage
  const removeFromSessionStorage = useCallback((key) => {
    try {
      sessionStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.error('Error removing from session storage:', error);
    }
  }, []);

  // Get cached data
  const getCachedData = useCallback((key) => {
    // First check in-memory cache
    if (cacheState[key]) {
      return cacheState[key];
    }
    
    // Then check session storage
    const sessionData = getFromSessionStorage(key);
    if (sessionData) {
      // Update in-memory cache
      setCacheState(prev => ({
        ...prev,
        [key]: sessionData
      }));
      return sessionData;
    }
    
    return null;
  }, [cacheState, getFromSessionStorage]);

  // Set cached data
  const setCachedData = useCallback((key, data, ttl = null) => {
    // Update in-memory cache
    setCacheState(prev => ({
      ...prev,
      [key]: data
    }));
    
    // Update session storage
    setToSessionStorage(key, data, ttl);
  }, [setToSessionStorage]);

  // Remove cached data
  const removeCachedData = useCallback((key) => {
    // Remove from in-memory cache
    setCacheState(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
    
    // Remove from session storage
    removeFromSessionStorage(key);
  }, [removeFromSessionStorage]);

  // Clear all cache
  const clearAllCache = useCallback(() => {
    // Clear in-memory cache
    setCacheState({});
    
    // Clear session storage (only cache items)
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing session storage:', error);
    }
  }, []);

  // Check if data exists in cache
  const isCached = useCallback((key) => {
    return cacheState[key] !== undefined || getFromSessionStorage(key) !== null;
  }, [cacheState, getFromSessionStorage]);

  // Get cache info
  const getCacheInfo = useCallback((key) => {
    try {
      const item = sessionStorage.getItem(`cache_${key}`);
      if (item) {
        const parsed = JSON.parse(item);
        return {
          hasData: true,
          timestamp: parsed.timestamp,
          expiry: parsed.expiry,
          isExpired: parsed.expiry ? Date.now() > parsed.expiry : false,
          age: Date.now() - parsed.timestamp
        };
      }
      return {
        hasData: false,
        timestamp: null,
        expiry: null,
        isExpired: false,
        age: 0
      };
    } catch (error) {
      console.error('Error getting cache info:', error);
      return {
        hasData: false,
        timestamp: null,
        expiry: null,
        isExpired: false,
        age: 0
      };
    }
  }, []);

  // Invalidate cache by pattern
  const invalidateByPattern = useCallback((pattern) => {
    // Clear from in-memory cache
    setCacheState(prev => {
      const newState = { ...prev };
      Object.keys(newState).forEach(key => {
        if (key.includes(pattern)) {
          delete newState[key];
        }
      });
      return newState;
    });

    // Clear from session storage
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_') && key.includes(pattern)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error invalidating cache by pattern:', error);
    }
  }, []);

  // Batch operations
  const batchSet = useCallback((items) => {
    const updates = {};
    items.forEach(({ key, data, ttl }) => {
      updates[key] = data;
      setToSessionStorage(key, data, ttl);
    });
    
    setCacheState(prev => ({
      ...prev,
      ...updates
    }));
  }, [setToSessionStorage]);

  const value = {
    // Core operations
    getCachedData,
    setCachedData,
    removeCachedData,
    clearAllCache,
    isCached,
    
    // Advanced operations
    getCacheInfo,
    invalidateByPattern,
    batchSet,
    
    // Direct session storage access (for special cases)
    getFromSessionStorage,
    setToSessionStorage,
    removeFromSessionStorage,
    
    // Cache state for debugging
    cacheState
  };

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
};

export default CacheContext;
