"use client";

import { useCurrentImageStore } from "@/lib/store/currentImage";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);

const ImageTitle = () => {
  const { currentImage } = useCurrentImageStore();

  useGSAP(() => {
    const titleElement = document.querySelector(".scrolling-title");
    if (!titleElement) return;

    // 计算文本是否溢出
    const isOverflowing = titleElement.scrollWidth > titleElement.clientWidth;

    if (isOverflowing) {
      const scrollDistance =
        titleElement.scrollWidth - titleElement.clientWidth;

      // 创建鼠标悬停时的动画
      const tl = gsap.timeline({ paused: true });
      tl.to(titleElement, {
        duration: 1.5,
        scrollLeft: scrollDistance,
      });

      // 添加鼠标事件监听
      titleElement.addEventListener("mouseenter", () => tl.play());
      titleElement.addEventListener("mouseleave", () => tl.reverse());
    }
  }, [currentImage]); // 当图片改变时重新运行

  return (
    <div className="flex items-center gap-[1rem] w-full">
      <p className="w-fit font-sans text-start rotate-90">↑</p>
      <p className="scrolling-title overflow-x-hidden whitespace-nowrap">
        {currentImage?.title}
      </p>
    </div>
  );
};

export default ImageTitle;
