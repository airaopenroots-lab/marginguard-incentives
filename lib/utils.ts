import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | number | null | undefined, formatStr: string = "MMM d, yyyy h:mm a") {
  if (!date) return "Never";
  const d = new Date(date);
  return format(d, formatStr);
}

export function formatRelativeTime(date: Date | string | number | null | undefined) {
  if (!date) return "N/A";
  const d = new Date(date);
  return formatDistanceToNow(d, { addSuffix: true });
}
