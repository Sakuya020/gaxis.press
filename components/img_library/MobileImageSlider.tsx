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
  const isScrollingDown = useRef(false);
  const lastScrollY = useRef(0);

  // 创建扩展后的图片数组（在原数组最后添加第一张图片）
  const extendedImages = [...images, images[0]];

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
      e.preventDefault(); // 防止回弹
      touchStartRef.current = e.touches[0].clientX;
      scrollStartRef.current = window.scrollY;
      touchTimeRef.current = Date.now();
      setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!section) return;

      const touchDelta = Math.abs(touchStartRef.current - e.touches[0].clientX);
      if (touchDelta > 10) {
        setIsDragging(true);
      }

      const scrollDelta = touchStartRef.current - e.touches[0].clientX;
      const newScrollY = scrollStartRef.current + scrollDelta * 2;

      // 检测滚动方向
      isScrollingDown.current = newScrollY > lastScrollY.current;

      // 获取当前进度和滚动范围
      const st = ScrollTrigger.getById("mobile-slider");
      const progress = st?.progress ?? 0;
      const maxScroll = st ? st.end - st.start : 0;

      // 限制滚动范围
      if (isScrollingDown.current && newScrollY >= maxScroll * 0.95) {
        // 如果向下滚动且接近最大值，则停在95%处
        window.scrollTo({
          top: maxScroll * 0.95,
          behavior: "auto",
        });
        return;
      }

      window.scrollTo({
        top: Math.max(0, Math.min(newScrollY, maxScroll * 0.95)),
        behavior: "auto",
      });

      lastScrollY.current = newScrollY;
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
  }, [images.length]);

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

    // 修改初始位置设置逻辑
    const currentProgress = timelineRef.current?.progress() || 0;
    items.forEach((item, index) => {
      if (index === 0) {
        gsap.set(item, { x: 0, y: 0 });
        return;
      }

      // 为最后一张图片（扩展的那张）设置特殊的初始位置
      if (index === items.length - 1) {
        gsap.set(item, {
          x: dimensions.width * images.length, // 将其放在原数组最后一张之后
          y: 0,
        });
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
        y: 0,
      });
    });

    // 创建新时间线
    timelineRef.current = gsap.timeline({
      scrollTrigger: {
        id: "mobile-slider",
        trigger: sectionRef.current,
        pin: true,
        pinSpacing: true,
        start: "top top",
        end: () => `+=${dimensions.width * (images.length - 1)}`,
        scrub: 1,
        onUpdate: (self) => {
          // 在接近末尾时缓慢停止
          if (self.progress > 0.95) {
            const remainingProgress = (self.progress - 0.95) / 0.05;
            const slowedScroll =
              self.start +
              dimensions.width *
                (images.length - 2) *
                (1 - Math.pow(remainingProgress, 2));
            self.scroll(slowedScroll);
          }
        },
      },
    });

    // 修改动画逻辑
    items.forEach((_, index) => {
      if (index === 0) return;
      const movingItems = Array.from(items).slice(index);
      timelineRef.current?.to(movingItems, {
        x: (i) => {
          // 如果是最后一张图片（扩展的那张），始终保持在视野外
          if (i + index === items.length - 1) {
            return dimensions.width * (images.length + 1);
          }
          // 如果是原数组的最后一张图片，使用缓动效果
          if (i + index === items.length - 2) {
            const progress = gsap.getProperty(movingItems[0], "x") as number;
            const maxX = dimensions.width * (images.length - 2);
            return progress > maxX * 0.95
              ? maxX + (progress - maxX * 0.95) * 0.2 // 减缓移动速度
              : i * dimensions.width;
          }
          return i * dimensions.width;
        },
        y: 0,
        duration: 1,
        ease: "none",
        onUpdate: function () {
          movingItems.forEach((item, i) => {
            // 不为最后两张图片设置边框透明度
            if (i + index < items.length - 2) {
              const x = gsap.getProperty(item, "x") as number;
              if (borderOpacities[index + i]) {
                const opacity = x < 2 ? 0 : 1;
                borderOpacities[index + i]?.(opacity);
              }
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
      className="w-full h-[calc(100vh-130px)] md:hidden block touch-none overflow-hidden"
    >
      <div ref={wrapperRef} className="h-full opacity-0">
        <div className="relative h-full">
          {extendedImages.map((item, index) => {
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
