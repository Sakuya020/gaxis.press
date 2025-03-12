"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { ImageType } from "@/lib/types";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ImageSlider = ({ images }: { images: ImageType[] }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const touchStartRef = useRef(0);
  const scrollStartRef = useRef(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const touchTimeRef = useRef(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  // 修改初始化尺寸的useEffect
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // 清除所有现有的 ScrollTrigger 实例
      ScrollTrigger.getAll().forEach((st) => st.kill());

      // 清除现有的时间线
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }

      // 重置状态
      setIsDragging(false);
      touchStartRef.current = 0;
      scrollStartRef.current = 0;
      touchTimeRef.current = 0;
    };

    updateDimensions();

    const debouncedUpdateDimensions = debounce(updateDimensions, 250);
    window.addEventListener("resize", debouncedUpdateDimensions);
    return () =>
      window.removeEventListener("resize", debouncedUpdateDimensions);
  }, []);

  // 添加debounce工具函数
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // 将水平滑动转换为垂直滚动
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientX;
      scrollStartRef.current = window.scrollY;
      touchTimeRef.current = Date.now();
      setIsDragging(false);
      // console.log("Touch start, isDragging:", false); // 调试日志
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!section) return;

      const touchDelta = Math.abs(touchStartRef.current - e.touches[0].clientX);
      // 如果移动距离超过阈值，标记为拖动
      if (touchDelta > 10) {
        setIsDragging(true);
        // console.log("Touch move, isDragging set to true, delta:", touchDelta); // 调试日志
      }

      const scrollDelta = touchStartRef.current - e.touches[0].clientX;
      const scrollY = scrollStartRef.current + scrollDelta * 3;

      window.scrollTo({
        top: scrollY,
        behavior: "auto",
      });
    };

    const handleTouchEnd = () => {
      const touchDuration = Date.now() - touchTimeRef.current;
      // console.log("Touch end, duration:", touchDuration); // 调试日志
      if (touchDuration < 200) {
        setIsDragging(false);
        // console.log("Reset isDragging to false"); // 调试日志
      }
    };

    section.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    section.addEventListener("touchmove", handleTouchMove, { passive: false });
    section.addEventListener("touchend", handleTouchEnd);

    return () => {
      section.removeEventListener("touchstart", handleTouchStart);
      section.removeEventListener("touchmove", handleTouchMove);
      section.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useGSAP(() => {
    if (!sectionRef.current || !wrapperRef.current) return;

    const items = wrapperRef.current.querySelectorAll(".item");

    // 为每个图片创建 opacity quickTo 实例
    const borderOpacities = Array.from(items).map((item) => {
      const border = item.querySelector(".border-element") as HTMLElement;
      return border
        ? gsap.quickTo(border, "opacity", {
            duration: 0.1,
            ease: "none",
          })
        : null;
    });

    const viewportHeight = dimensions.height - 130;

    // 清除现有动画
    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars.trigger === sectionRef.current) {
        st.kill();
      }
    });
    if (timelineRef.current) timelineRef.current.kill();
    gsap.killTweensOf(items);

    // 获取当前进度并重置位置
    const currentProgress = timelineRef.current?.progress() || 0;
    items.forEach((item, index) => {
      if (index === 0) {
        gsap.set(item, { x: 0, y: 0 }); // 添加 y: 0 确保垂直位置固定
        return;
      }
      const initialX = dimensions.width * index - dimensions.width * 0.2;
      const targetX = index * dimensions.width;

      const adjustedX =
        currentProgress > 0
          ? initialX - dimensions.width * currentProgress * (items.length - 1)
          : initialX;

      gsap.set(item, {
        x: Math.max(0, adjustedX),
        y: 0, // 添加 y: 0 确保垂直位置固定
      });
    });

    // 创建新时间线
    timelineRef.current = gsap.timeline({
      scrollTrigger: {
        id: "mobile-slider",
        trigger: sectionRef.current,
        pin: true,
        pinSpacing: true, // 确保 pin 时保持间距
        start: "top top",
        end: () => `+=${dimensions.width * (items.length - 2)}`,
        scrub: 1,
      },
    });

    // 修改动画，在移动时更新边框透明度
    items.forEach((_, index) => {
      if (index === 0) return;
      const movingItems = Array.from(items).slice(index);
      timelineRef.current?.to(movingItems, {
        x: (i) => {
          const targetX = i * dimensions.width;
          return i + index === items.length - 1
            ? Math.max(0, targetX)
            : targetX;
        },
        y: 0,
        duration: 1,
        ease: "none",
        onUpdate: function () {
          movingItems.forEach((item, i) => {
            const x = gsap.getProperty(item, "x") as number;
            if (borderOpacities[index + i]) {
              const opacity = x < 2 ? 0 : 1;
              borderOpacities[index + i]?.(opacity);
            }
          });
        },
      });
    });
  }, [images, dimensions]);

  // 添加图片加载计数器
  const handleImageLoad = () => {
    setImagesLoaded((prev) => prev + 1);
  };

  // 添加入场动画
  useEffect(() => {
    if (imagesLoaded >= 2 && wrapperRef.current) {
      gsap.fromTo(
        wrapperRef.current,
        {
          x: 40,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        }
      );
    }
  }, [imagesLoaded]);

  return (
    <div
      ref={sectionRef}
      className="w-full h-[calc(100vh-130px)] md:hidden block touch-none"
    >
      <div ref={wrapperRef} className="h-full opacity-0">
        <div className="relative h-full">
          {images.map((item, index) => {
            const { title, image, link } = item;
            if (!image) return null;
            const imgUrl = getImageUrl(image);
            return (
              <div key={title} className="item absolute inset-0 h-full">
                <figure
                  className={cn(
                    "relative h-full w-full border-background",
                    link && "cursor-pointer"
                  )}
                  onClick={(e) => {
                    if (!isDragging && link) {
                      window.open(link, "_blank");
                    }
                  }}
                >
                  {index !== 0 && (
                    <div className="border-element absolute left-0 top-0 h-full border-l border-background z-10" />
                  )}
                  <Image
                    src={imgUrl}
                    alt={title}
                    fill
                    style={{ objectFit: "cover", aspectRatio: "2247/1500" }}
                    onLoad={handleImageLoad}
                  />
                </figure>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
