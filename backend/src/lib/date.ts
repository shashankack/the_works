import { format, parseISO } from "date-fns";

export function extractDateAndTime(dateTime: string): {
  date: string;
  time: string;
} {
  const date = parseISO(dateTime);
  return {
    date: format(date, "PPP"),
    time: format(date, "p"),
  };
}
