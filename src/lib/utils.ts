import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertDateToIST(dateString: string) {
  const date = new Date(dateString);
  const ISTTime = new Date(date.getTime() + 60 * 1000);
  const ISTDateString = ISTTime.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return ISTDateString;
}