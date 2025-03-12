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

    // 先重置滚动位置
    titleElement.scrollLeft = 0;

    // 计算文本是否溢出
    const isOverflowing = titleElement.scrollWidth > titleElement.clientWidth;

    if (isOverflowing) {
      const scrollDistance =
        titleElement.scrollWidth - titleElement.clientWidth;

      // 创建鼠标悬停时的动画
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(
        titleElement,
        { scrollLeft: 0 },
        {
          scrollLeft: scrollDistance,
          duration: 1.5,
          ease: "power2.out",
          onComplete: () => {
            titleElement.scrollLeft = scrollDistance;
          },
          onReverseComplete: () => {
            titleElement.scrollLeft = 0;
          },
        }
      );

      const handleEnter = () => {
        tl.play();
      };
      const handleLeave = () => {
        tl.pause();
        titleElement.scrollLeft = 0;
      };

      // 添加鼠标事件监听
      titleElement.addEventListener("mouseenter", handleEnter);
      titleElement.addEventListener("mouseleave", handleLeave);

      // 清理函数
      return () => {
        titleElement.removeEventListener("mouseenter", handleEnter);
        titleElement.removeEventListener("mouseleave", handleLeave);
        // 确保在组件更新时重置滚动位置
        titleElement.scrollLeft = 0;
      };
    }
  }, [currentImage]);

  return (
    <div className="flex items-center gap-[1rem] w-full">
      <p className="w-fit font-sans text-start rotate-90">↑</p>
      <p className="scrolling-title overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-x-hidden hover:text-clip">
        {currentImage?.title}
      </p>
    </div>
  );
};

export default ImageTitle;
