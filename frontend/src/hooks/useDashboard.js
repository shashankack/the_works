import { useCallback } from 'react';
import { useCache } from '../context/CacheContext';
import { useCachedClasses } from './useCachedClasses';
import { useCachedEvents } from './useCachedEvents';
import { useCachedBookings } from './useCachedBookings';
import { useCachedTrainers } from './useCachedTrainers';

export const useDashboard = (options = {}) => {
  const {
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000, // 5 minutes
  } = options;

  const cache = useCache();

  // Individual cached hooks
  const classesHook = useCachedClasses({ 
    immediate: true,
    ttl: 5 * 60 * 1000 // 5 minutes
  });
  
  const eventsHook = useCachedEvents({ 
    immediate: true,
    ttl: 5 * 60 * 1000 // 5 minutes
  });
  
  const bookingsHook = useCachedBookings({ 
    immediate: true,
    ttl: 2 * 60 * 1000 // 2 minutes for dynamic data
  });
  
  const trainersHook = useCachedTrainers({ 
    immediate: true,
    adminMode: true,
    ttl: 10 * 60 * 1000 // 10 minutes
  });

  // Combined loading state
  const loading = classesHook.loading || eventsHook.loading || 
                 bookingsHook.loading || trainersHook.loading;

  // Combined error state
  const errors = {
    classes: classesHook.error,
    events: eventsHook.error,
    bookings: bookingsHook.error,
    trainers: trainersHook.error
  };

  const hasErrors = Object.values(errors).some(error => error !== null);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    try {
      await Promise.all([
        classesHook.refetch(),
        eventsHook.refetch(),
        bookingsHook.refetch(),
        trainersHook.refetch()
      ]);
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    }
  }, [classesHook.refetch, eventsHook.refetch, bookingsHook.refetch, trainersHook.refetch]);

  // Clear all dashboard cache
  const clearAllCache = useCallback(() => {
    classesHook.clearClassesCache();
    eventsHook.clearEventsCache();
    bookingsHook.clearBookingsCache();
    trainersHook.clearTrainersCache();
  }, [
    classesHook.clearClassesCache,
    eventsHook.clearEventsCache,
    bookingsHook.clearBookingsCache,
    trainersHook.clearTrainersCache
  ]);

  // Get cache status for all data
  const cacheStatus = {
    classes: {
      isCached: classesHook.isCached,
      isStale: classesHook.isStale
    },
    events: {
      isCached: eventsHook.isCached,
      isStale: eventsHook.isStale
    },
    bookings: {
      isCached: bookingsHook.isCached,
      isStale: bookingsHook.isStale
    },
    trainers: {
      isCached: trainersHook.isCached,
      isStale: trainersHook.isStale
    }
  };

  // Check if any data is stale
  const hasStaleData = Object.values(cacheStatus).some(status => status.isStale);

  // Dashboard statistics
  const stats = {
    totalClasses: classesHook.classes?.length || 0,
    totalEvents: eventsHook.events?.length || 0,
    totalBookings: bookingsHook.bookings?.length || 0,
    totalTrainers: trainersHook.trainers?.length || 0,
    
    // Recent bookings (last 7 days)
    recentBookings: bookingsHook.bookings?.filter(booking => {
      const bookingDate = new Date(booking.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return bookingDate >= weekAgo;
    }).length || 0,

    // Upcoming events (next 30 days)
    upcomingEvents: eventsHook.events?.filter(event => {
      const eventDate = new Date(event.date);
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return eventDate >= now && eventDate <= thirtyDaysFromNow;
    }).length || 0
  };

  // Invalidate related cache when data changes
  const invalidateRelatedCache = useCallback((type) => {
    switch (type) {
      case 'booking':
        // Invalidate bookings and possibly events if they're related
        cache.invalidateByPattern('booking');
        break;
      case 'class':
        // Invalidate classes and schedules
        cache.invalidateByPattern('class');
        break;
      case 'event':
        cache.invalidateByPattern('event');
        break;
      case 'trainer':
        cache.invalidateByPattern('trainer');
        break;
      default:
        break;
    }
  }, [cache]);

  return {
    // Data
    classes: classesHook.classes,
    events: eventsHook.events,
    bookings: bookingsHook.bookings,
    trainers: trainersHook.trainers,
    
    // Loading and error states
    loading,
    errors,
    hasErrors,
    
    // Actions
    refreshAll,
    clearAllCache,
    invalidateRelatedCache,
    
    // Individual refresh functions
    refreshClasses: classesHook.refetch,
    refreshEvents: eventsHook.refetch,
    refreshBookings: bookingsHook.refetch,
    refreshTrainers: trainersHook.refetch,
    
    // Cache status
    cacheStatus,
    hasStaleData,
    
    // Statistics
    stats,
    
    // Individual hooks for advanced usage
    hooks: {
      classes: classesHook,
      events: eventsHook,
      bookings: bookingsHook,
      trainers: trainersHook
    }
  };
};

export default useDashboard;
