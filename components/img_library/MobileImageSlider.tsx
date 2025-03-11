"use client";

import { useRef, useEffect, useState, useMemo } from "react";
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
  const [currentGroup, setCurrentGroup] = useState(0);
  const totalGroups = 3;

  // 创建循环图片数组
  const loopedImages = useMemo(() => {
    const result = [];
    for (let i = 0; i < totalGroups; i++) {
      result.push(...images);
    }
    return result;
  }, [images]);

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

    let lastY = 0;
    let lastX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY;
      lastX = e.touches[0].clientX;
      touchStartRef.current = e.touches[0].clientX;
      scrollStartRef.current = window.scrollY;
      touchTimeRef.current = Date.now();
      setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaX = Math.abs(e.touches[0].clientX - lastX);
      const deltaY = Math.abs(e.touches[0].clientY - lastY);

      // 如果水平移动大于垂直移动，阻止默认行为
      if (deltaX > deltaY) {
        e.preventDefault();
      }

      if (!section) return;

      const touchDelta = Math.abs(touchStartRef.current - e.touches[0].clientX);
      if (touchDelta > 10) {
        setIsDragging(true);
      }

      const scrollDelta = touchStartRef.current - e.touches[0].clientX;
      const scrollY = scrollStartRef.current + scrollDelta * 2;

      window.scrollTo({
        top: scrollY,
        behavior: "auto",
      });

      lastY = e.touches[0].clientY;
      lastX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const touchDuration = Date.now() - touchTimeRef.current;
      if (touchDuration < 200) {
        setIsDragging(false);
      }
    };

    // 阻止整个页面的默认滚动行为
    const preventScroll = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (section.contains(target)) {
        e.preventDefault();
      }
    };

    // 添加事件监听器
    section.addEventListener("touchstart", handleTouchStart, { passive: true });
    section.addEventListener("touchmove", handleTouchMove, { passive: false });
    section.addEventListener("touchend", handleTouchEnd);

    // 添加全局触摸事件监听器
    document.body.addEventListener("touchmove", preventScroll, {
      passive: false,
    });

    return () => {
      section.removeEventListener("touchstart", handleTouchStart);
      section.removeEventListener("touchmove", handleTouchMove);
      section.removeEventListener("touchend", handleTouchEnd);
      document.body.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  useGSAP(() => {
    if (!sectionRef.current || !wrapperRef.current) return;

    const items = wrapperRef.current.querySelectorAll(".item");
    const originalLength = images.length;

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
      const groupIndex = Math.floor(index / originalLength);
      const itemIndex = index % originalLength;

      if (itemIndex === 0) {
        gsap.set(item, {
          x: dimensions.width * originalLength * groupIndex,
          y: 0,
        });
        return;
      }

      const initialX =
        dimensions.width * itemIndex -
        dimensions.width * 0.2 +
        dimensions.width * originalLength * groupIndex;
      const targetX =
        itemIndex * dimensions.width +
        dimensions.width * originalLength * groupIndex;

      const adjustedX =
        currentProgress > 0
          ? initialX - dimensions.width * currentProgress * (originalLength - 1)
          : initialX;

      gsap.set(item, {
        x: Math.max(dimensions.width * originalLength * groupIndex, adjustedX),
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
        end: () => `+=${dimensions.width * (originalLength - 2)}`,
        scrub: 1,
        onUpdate: (self) => {
          // 当滚动到末尾时，切换到下一组
          if (self.progress >= 0.99) {
            setCurrentGroup((prev) => (prev + 1) % totalGroups);
            ScrollTrigger.getById("mobile-slider")?.scroll(0);
          }
        },
      },
    });

    // 修改动画，在移动时更新边框透明度
    items.forEach((_, index) => {
      if (index % originalLength === 0) return;
      const groupStartIndex =
        Math.floor(index / originalLength) * originalLength;
      const movingItems = Array.from(items).slice(
        groupStartIndex + (index % originalLength),
        groupStartIndex + originalLength
      );

      timelineRef.current?.to(movingItems, {
        x: (i) => {
          const baseX =
            dimensions.width *
            originalLength *
            Math.floor(index / originalLength);
          const targetX = (i - groupStartIndex) * dimensions.width + baseX;
          return i - groupStartIndex + (index % originalLength) ===
            originalLength - 1
            ? Math.max(baseX, targetX)
            : targetX;
        },
        y: 0,
        duration: 1,
        ease: "none",
        onUpdate: function () {
          movingItems.forEach((item, i) => {
            const x = gsap.getProperty(item, "x") as number;
            const opacityIndex = groupStartIndex + i;
            if (borderOpacities[opacityIndex]) {
              const opacity =
                x <
                dimensions.width *
                  originalLength *
                  Math.floor(index / originalLength) +
                  2
                  ? 0
                  : 1;
              borderOpacities[opacityIndex]?.(opacity);
            }
          });
        },
      });
    });
  }, [images, dimensions, currentGroup]);

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
      style={{ touchAction: "none" }}
    >
      <div ref={wrapperRef} className="h-full opacity-0">
        <div className="relative h-full">
          {loopedImages.map((item, index) => {
            const { title, image, link } = item;
            if (!image) return null;
            const imgUrl = getImageUrl(image);
            return (
              <div
                key={`${title}-${index}`}
                className="item absolute inset-0 h-full"
              >
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
