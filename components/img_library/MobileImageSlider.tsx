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
  const [initialImagesLoaded, setInitialImagesLoaded] = useState(false);
  const loadedImagesCount = useRef(0);
  const animationStarted = useRef(false);

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

  // 处理图片加载
  const handleImageLoad = (index: number) => {
    loadedImagesCount.current += 1;

    // 只要前两张图片加载完成就开始动画
    if (loadedImagesCount.current >= Math.min(2, images.length)) {
      setInitialImagesLoaded(true);
    }
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
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!section) return;

      const touchDelta = Math.abs(touchStartRef.current - e.touches[0].clientX);
      // 如果移动距离超过阈值，标记为拖动
      if (touchDelta > 10) {
        setIsDragging(true);
      }

      const scrollDelta = touchStartRef.current - e.touches[0].clientX;
      const scrollY = scrollStartRef.current + scrollDelta * 2;

      window.scrollTo({
        top: scrollY,
        behavior: "auto",
      });
    };

    const handleTouchEnd = () => {
      const touchDuration = Date.now() - touchTimeRef.current;
      if (touchDuration < 200) {
        setIsDragging(false);
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
    const viewportHeight = dimensions.height - 130;

    // 清除现有动画
    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars.trigger === sectionRef.current) {
        st.kill();
      }
    });
    if (timelineRef.current) timelineRef.current.kill();
    gsap.killTweensOf(items);

    // 如果前两张图片已加载完成且动画尚未开始，则开始入场动画
    if (initialImagesLoaded && !animationStarted.current) {
      animationStarted.current = true;

      // 设置初始位置
      items.forEach((item, index) => {
        if (index === 0) {
          gsap.set(item, { opacity: 0, x: 20, y: 0 });
        } else {
          const initialX = dimensions.width * index;
          gsap.set(item, {
            opacity: 0,
            x: initialX + 20,
            y: 0,
          });
        }
      });

      // 创建入场动画
      const entranceTimeline = gsap.timeline();

      // 首先显示第一张图片
      entranceTimeline.to(items[0], {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      // 完全等待第一张图片动画完成后，再开始第二张图片的动画
      entranceTimeline.add(() => {
        // 确保第二张图片的初始状态是完全透明且偏移的
        if (loadedImagesCount.current >= 2 && items[1]) {
          // 计算第二张图片在滚动动画中的初始位置
          // 这应该与滚动动画初始化时的位置计算方式完全一致
          const initialX = dimensions.width - dimensions.width * 0.2;

          // 设置初始状态
          gsap.set(items[1], {
            opacity: 0.6,
            x: initialX + 20, // 从初始位置右侧40px开始
            y: 0,
          });

          // 创建单独的时间线用于第二张图片
          const secondImageTimeline = gsap.timeline();

          // 添加第二张图片的动画，确保移动到正确的初始位置
          secondImageTimeline.to(items[1], {
            opacity: 1,
            x: initialX, // 使用与滚动动画相同的初始位置计算
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
              // 动画完成后再次确认位置正确
              gsap.set(items[1], { x: initialX });
            },
          });
        }
      }, "+=0.2");

      // 为后续加载的图片添加显示逻辑
      const showLaterImages = () => {
        const loadedCount = loadedImagesCount.current;
        if (loadedCount > 2) {
          for (let i = 2; i < loadedCount; i++) {
            if (items[i] && gsap.getProperty(items[i], "opacity") === 0) {
              gsap.to(items[i], {
                opacity: 1,
                x: dimensions.width * i,
                duration: 0.5,
                ease: "power2.out",
              });
            }
          }
        }
      };

      // 定期检查是否有新图片加载完成
      const checkInterval = setInterval(showLaterImages, 200);

      // 入场动画完成后设置滚动动画
      entranceTimeline.call(() => {
        clearInterval(checkInterval);

        // 重新设置所有图片的位置，准备滚动动画，但保留第二张图片的位置
        items.forEach((item, index) => {
          if (index === 0) {
            gsap.set(item, { x: 0, y: 0 });
            return;
          }

          // 跳过第二张图片，保留其当前位置
          if (index === 1 && loadedImagesCount.current >= 2) {
            return;
          }

          const initialX = dimensions.width * index - dimensions.width * 0.2;
          gsap.set(item, {
            x: Math.max(0, initialX),
            y: 0,
          });
        });

        initScrollAnimation(items);
      });
    } else if (!initialImagesLoaded) {
      // 如果图片尚未加载完成，隐藏所有图片
      items.forEach((item) => {
        gsap.set(item, { opacity: 0 });
      });
    } else {
      // 如果动画已经开始过，直接设置正常位置并初始化滚动动画
      // 获取当前进度并重置位置
      const currentProgress = timelineRef.current?.progress() || 0;
      items.forEach((item, index) => {
        if (index === 0) {
          gsap.set(item, { opacity: 1, x: 0, y: 0 });
          return;
        }
        const initialX = dimensions.width * index - dimensions.width * 0.2;
        const targetX = index * dimensions.width;

        const adjustedX =
          currentProgress > 0
            ? initialX - dimensions.width * currentProgress * (items.length - 1)
            : initialX;

        gsap.set(item, {
          opacity: 1,
          x: Math.max(0, adjustedX),
          y: 0,
        });
      });

      initScrollAnimation(items);
    }

    // 初始化滚动动画
    function initScrollAnimation(items: NodeListOf<Element>) {
      // 创建新时间线
      timelineRef.current = gsap.timeline({
        scrollTrigger: {
          id: "mobile-slider",
          trigger: sectionRef.current,
          pin: true,
          pinSpacing: true,
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
          y: 0,
          duration: 1,
          ease: "none",
        });
      });
    }
  }, [images, dimensions, initialImagesLoaded]);

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
              <div
                key={title}
                className="item absolute inset-0 h-full"
                style={{ opacity: 0 }} // 初始设置为不可见，由GSAP控制显示
              >
                <figure
                  className={cn(
                    "relative h-full w-full border-background",
                    link && "cursor-pointer",
                    index !== 0 && "border-l"
                  )}
                  onClick={(e) => {
                    if (!isDragging && link) {
                      window.open(link, "_blank");
                    }
                  }}
                >
                  <Image
                    src={imgUrl}
                    alt={title}
                    fill
                    style={{ objectFit: "cover", aspectRatio: "2247/1500" }}
                    onLoad={() => handleImageLoad(index)}
                    priority={index < 2} // 优先加载前两张图片
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
