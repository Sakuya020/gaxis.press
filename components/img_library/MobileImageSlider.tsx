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

  // 初始化尺寸，在屏幕尺寸变化时更新
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [images]);

  // 将水平滑动转换为垂直滚动
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientX;
      scrollStartRef.current = window.scrollY;
      // 防止触摸时页面滚动
      e.preventDefault();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!section) return;

      const touchDelta = touchStartRef.current - e.touches[0].clientX;
      // 将水平滑动距离转换为垂直滚动距离（可以调整系数来控制灵敏度）
      const scrollY = scrollStartRef.current + touchDelta * 2;

      window.scrollTo({
        top: scrollY,
        behavior: "auto", // 使用 'auto' 而不是 'smooth' 以获得更好的响应
      });

      e.preventDefault();
    };

    section.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    section.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      section.removeEventListener("touchstart", handleTouchStart);
      section.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useGSAP(() => {
    if (!sectionRef.current || !wrapperRef.current) return;

    const items = wrapperRef.current.querySelectorAll(".item");
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

    // 修改动画，确保只在 x 轴方向移动
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
        y: 0, // 明确设置 y 为 0
        duration: 1,
        ease: "none",
      });
    });
  }, [images, dimensions]);

  return (
    <div
      ref={sectionRef}
      className="w-full h-[calc(100vh-130px)] md:hidden block touch-none"
    >
      <div ref={wrapperRef} className="h-full">
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
                    link && "cursor-pointer",
                    index !== 0 && "border-l"
                  )}
                  onClick={() => {
                    if (link) {
                      window.open(link, "_blank");
                    }
                  }}
                >
                  <Image
                    src={imgUrl}
                    alt={title}
                    fill
                    style={{ objectFit: "cover", aspectRatio: "2247/1500" }}
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
