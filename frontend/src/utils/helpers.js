export const getClassStatus = (schedules = []) => {
  const now = new Date();
  const today = now.getDay(); // 0 = Sunday, ..., 6 = Saturday
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const getStatusForSchedule = (dayOfWeek, startTime, endTime) => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    const daysUntil = (dayOfWeek - today + 7) % 7;

    if (daysUntil === 0) {
      // It's today
      if (currentMinutes < startMinutes) return "upcoming";
      if (currentMinutes >= startMinutes && currentMinutes <= endMinutes)
        return "ongoing";
      return "completed";
    }

    // It's a future day
    return "upcoming";
  };

  // Check all schedules
  const statuses = schedules.map((s) =>
    getStatusForSchedule(s.dayOfWeek, s.startTime, s.endTime)
  );

  // Priority logic
  if (statuses.includes("ongoing")) return "ongoing";
  if (statuses.includes("upcoming")) return "upcoming";
  return "completed";
};

export const getEventStatus = (startDateTime, endDateTime) => {
  const now = new Date();
  const start = new Date(startDateTime);
  const end = endDateTime ? new Date(endDateTime) : null;

  if (now < start) return "upcoming";
  if (end && now > end) return "completed";
  return "ongoing";
};
