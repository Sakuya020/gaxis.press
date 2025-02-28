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

export function formatDate(dateString: string) {
  // 将日期字符串分割成年、月、日
  const [year, month] = dateString.split("-");

  // 获取年份的后两位
  const shortYear = year.slice(2);

  // 确保月份有两位数
  const paddedMonth = month.padStart(2, "0");

  return `${shortYear}.${paddedMonth}`;
}
