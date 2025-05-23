"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { ImageType } from "@/lib/types";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCurrentImageStore } from "@/lib/store/currentImage";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ImageSlider = ({ images }: { images: ImageType[] }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const setCurrentImage = useCurrentImageStore(
    (state) => state.setCurrentImage
  );
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();

  // 修改防抖函数
  const debounceResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
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

      // resize 后重置为第一张图片
      setCurrentImage(images[0]);
    }, 250);
  }, [setCurrentImage, images]);

  useEffect(() => {
    setCurrentImage(images[0]);

    // 初始化尺寸
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    window.addEventListener("resize", debounceResize);
    return () => {
      window.removeEventListener("resize", debounceResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [images, debounceResize]);

  useGSAP(() => {
    if (!sectionRef.current || !wrapperRef.current) return;

    const wrapper = wrapperRef.current.querySelector(
      ".relative"
    ) as HTMLElement;
    const items = wrapperRef.current.querySelectorAll(".item");
    const viewportHeight = dimensions.height - 150;
    const slideWidth = (viewportHeight * 2247) / 1500;
    const margin = dimensions.width - slideWidth;
    const triggerPoint = dimensions.width / 3;

    // 只在初始加载时设置opacity
    if (!initialLoadComplete) {
      gsap.set(items, {
        autoAlpha: 0,
      });

      gsap.set(wrapper, {
        autoAlpha: 0,
        x: 20,
        visibility: "hidden",
      });
    } else {
      // 在resize时保持可见性
      gsap.set(wrapper, {
        autoAlpha: 1,
        x: 0,
        visibility: "visible",
      });
    }

    // 设置每个图片的初始位置（相对位置）
    gsap.set(items, {
      x: (i) => (i === 0 ? 0 : i * slideWidth),
    });

    // 为每个图片创建 opacity quickTo 实例
    const borderOpacities = Array.from(items).map((item) => {
      const border = item.querySelector(".border-l-element") as HTMLElement;
      return gsap.quickTo(border, "opacity", {
        duration: 0.1,
        ease: "none",
      });
    });

    // 修改预加载图片的逻辑
    const preloadImages = async () => {
      // 优先加载前两张图片
      const firstTwoImages = Array.from(items).slice(0, 2);
      const remainingImages = Array.from(items).slice(2);

      // 加载前两张图片
      const loadFirstTwo = firstTwoImages.map((item) => {
        return new Promise((resolve) => {
          const img = item.querySelector("img");
          if (img?.complete) {
            resolve(true);
          } else {
            img?.addEventListener("load", () => resolve(true));
            img?.addEventListener("error", () => resolve(false));
          }
        });
      });

      // 等待前两张图片加载完成
      await Promise.all(loadFirstTwo);

      if (!initialLoadComplete) {
        // 只在初始加载时执行入场动画
        const showSequence = gsap.timeline({
          onStart: () => {
            gsap.set(wrapper, { visibility: "visible" });
            gsap.set(firstTwoImages, { autoAlpha: 1 });
            setImagesLoaded(true);
          },
        });

        showSequence.to(wrapper, {
          autoAlpha: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
          onComplete: () => {
            setInitialLoadComplete(true);
            createScrollAnimation();
          },
        });
      } else {
        // resize时直接创建滚动动画
        gsap.set(firstTwoImages, { autoAlpha: 1 });
        setImagesLoaded(true);
        createScrollAnimation();
      }

      // 异步加载剩余图片
      if (remainingImages.length > 0) {
        const loadRemaining = remainingImages.map((item) => {
          return new Promise((resolve) => {
            const img = item.querySelector("img");
            if (img?.complete) {
              gsap.to(item, { autoAlpha: 1, duration: 0.3 });
              resolve(true);
            } else {
              img?.addEventListener("load", () => {
                gsap.to(item, { autoAlpha: 1, duration: 0.3 });
                resolve(true);
              });
              img?.addEventListener("error", () => resolve(false));
            }
          });
        });

        // 后台加载剩余图片
        Promise.all(loadRemaining).catch(console.error);
      }
    };

    preloadImages();

    // 滚动动画创建函数
    const createScrollAnimation = () => {
      // 清除现有动画
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === sectionRef.current) {
          st.kill();
        }
      });
      if (timelineRef.current) timelineRef.current.kill();

      timelineRef.current = gsap.timeline({
        scrollTrigger: {
          id: "desktop-slider",
          trigger: sectionRef.current,
          pin: true,
          start: "top top+=150px",
          end: () => `+=${slideWidth * (items.length - 2) + margin}`,
          scrub: 1,
          onUpdate: (self) => {
            items.forEach((item, index) => {
              const x = gsap.getProperty(item, "x") as number;

              // 使用 quickTo 来平滑处理边框颜色
              if (borderOpacities[index]) {
                const opacity = x < 2 ? 0 : 1;
                borderOpacities[index](opacity);
              }

              if (x < triggerPoint && x > 0) {
                setCurrentImage(images[index]);
              }
              if (x > triggerPoint && index === 1 && self.direction < 0) {
                setCurrentImage(images[0]);
              }
            });
          },
          onScrubComplete: (self) => {
            // 在滚动结束时检查同步
            const progress = self.progress;

            // 如果滚动进度接近0，说明在顶部
            if (progress < 0.01) {
              setCurrentImage(images[0]);
              return;
            }
            // 如果滚动进度接近1
            if (progress > 0.95) {
              setCurrentImage(images[items.length - 1]);
              return;
            }

            // 检查其他项目
            items.forEach((item, index) => {
              const x = gsap.getProperty(item, "x") as number;
              if (x < triggerPoint && x > 0) {
                setCurrentImage(images[index]);
              }
            });
          },
        },
      });

      // 添加滚动动画
      items.forEach((_, index) => {
        if (index === 0) return;
        const movingItems = Array.from(items).slice(index);
        timelineRef.current?.to(movingItems, {
          x: (i) => {
            const targetX = i * slideWidth;
            return i + index === items.length - 1
              ? Math.max(margin, targetX)
              : targetX;
          },
          duration: 1,
          ease: "none",
        });
      });
    };
  }, [images, dimensions, initialLoadComplete]);

  return (
    <div
      ref={sectionRef}
      className="w-full h-[calc(100vh-150px)] hidden md:block overflow-hidden"
    >
      <div ref={wrapperRef} className="h-full">
        <div className="relative h-full opacity-0 invisible">
          {images.map((item, index) => {
            const { title, image, link } = item;
            if (!image) return null;
            const imgUrl = getImageUrl(image);
            return (
              <div
                key={title}
                className="item absolute inset-0 h-full"
                onClick={() => {
                  if (link) {
                    window.open(link, "_blank");
                  }
                }}
              >
                <figure
                  className={cn(
                    "relative h-full aspect-[2247/1500]",
                    link && "cursor-pointer"
                  )}
                >
                  {index !== 0 && (
                    <div className="border-l-element absolute left-0 top-0 h-full border-l border-background z-10" />
                  )}
                  <Image src={imgUrl} alt={title} fill />
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
