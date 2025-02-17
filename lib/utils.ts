import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(url: string) {
  const extension = url.substring(url.lastIndexOf("-") + 1);
  const regex = new RegExp("image-(.*?)-" + extension);
  const fileName = url.match(regex);

  return (
    `https://cdn.sanity.io/images/vo1wf6t4/production/` +
    fileName![1] +
    "." +
    extension
  );
}
