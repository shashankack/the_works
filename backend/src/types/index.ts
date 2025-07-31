export type UserRole = "admin" | "user" | "trainer";
export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
}

export interface Class {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  location?: string;
  thumbnail?: string;
  gallery?: string[];
  maxSpots: number;
  bookedSpots: number;
  isActive: boolean;
  createdAt: string;
}

export interface ClassSchedule {
  id: string;
  classId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // (HH:mm)
  endTime: string; // (HH:mm)
}

export interface ClassPack {
  id: string;
  classId: string;
  classType: "solo" | "group";
  title: string;
  description?: string;
  numberOfSessions: number;
  price: number; // in rupees
  duration: number; // in minutes
  isRecurring: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  location?: string;
  thumbnail?: string;
  gallery?: string[];
  isRecurring: boolean;
  startDate: string; // (YYYY-MM-DD HH:mm:ss)
  endDate: string; // (YYYY-MM-DD HH:mm:ss)
  repeatPattern?: string; // e.g., "weekly", "monthly"
  maxSpots: number;
  bookedSpots: number;
  isActive: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  classId: string;
  classTypeId?: string;
  classPackId?: string;
  eventId?: string;
  status: BookingStatus;
  bookedAt: string; // (YYYY-MM-DD HH:mm:ss)
  updatedAt: string; // (YYYY-MM-DD HH:mm:ss)
}

export interface Addon {
  id: string;
  classId?: string;
  eventId?: string;
  title: string;
  description?: string;
  price: number; // in rupees
  isActive: boolean;
  createdAt: string; // (YYYY-MM-DD HH:mm:ss)
}

export interface Trainer {
  id: string;
  userId: string; // references User
  bio?: string;
  expertise?: string[];
  isActive: boolean;
  createdAt: string; // (YYYY-MM-DD HH:mm:ss)
}
