import { type ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function isModuleUnlocked(moduleIndex: number, completedModules: number[]): boolean {
  if (moduleIndex === 0) return true;
  return completedModules.includes(moduleIndex - 1);
}

export function isVideoUnlocked(videoIndex: number, completedVideos: number[]): boolean {
  if (videoIndex === 0) return true;
  return completedVideos.includes(videoIndex - 1);
}


