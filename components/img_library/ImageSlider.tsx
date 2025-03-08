"use client";

import { useRef, useEffect, useState } from "react";
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
  const [initialImagesLoaded, setInitialImagesLoaded] = useState(false);
  const loadedImagesCount = useRef(0);
  const setCurrentImage = useCurrentImageStore(
    (state) => state.setCurrentImage
  );

  useEffect(() => {
    setCurrentImage(images[0]);

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 初始化尺寸
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

  useGSAP(() => {
    if (!sectionRef.current || !wrapperRef.current || !initialImagesLoaded)
      return;

    const items = wrapperRef.current.querySelectorAll(".item");
    const viewportHeight = dimensions.height - 150;
    const slideWidth = (viewportHeight * 2247) / 1500;
    const margin = dimensions.width - slideWidth;
    const triggerPoint = dimensions.width / 3;

    // 清除现有动画，但只清除属于该组件的动画
    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars.trigger === sectionRef.current) {
        st.kill();
      }
    });
    if (timelineRef.current) timelineRef.current.kill();
    gsap.killTweensOf(items);

    // 设置初始状态：所有图片透明度为0，向右偏移20px
    items.forEach((item, index) => {
      if (index === 0) {
        gsap.set(item, { opacity: 0, x: 20 });
      } else {
        gsap.set(item, {
          opacity: 0,
          x: index * slideWidth + 20,
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

    // 然后显示其他图片（已加载的）
    for (
      let i = 1;
      i < Math.min(loadedImagesCount.current, items.length);
      i++
    ) {
      entranceTimeline.to(
        items[i],
        {
          opacity: 1,
          x: i * slideWidth,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3" // 稍微重叠动画
      );
    }

    // 为后续加载的图片添加显示逻辑
    const showLaterImages = () => {
      const loadedCount = loadedImagesCount.current;
      if (loadedCount > 2) {
        for (let i = 2; i < loadedCount; i++) {
          if (items[i] && gsap.getProperty(items[i], "opacity") === 0) {
            gsap.to(items[i], {
              opacity: 1,
              x: i * slideWidth,
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
      // 创建新时间线
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
              if (x < triggerPoint && x > 0) {
                setCurrentImage(images[index]);
              }
              if (x > triggerPoint && index === 1 && self.direction < 0) {
                setCurrentImage(images[0]);
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
    });

    return () => {
      clearInterval(checkInterval);
    };
  }, [images, dimensions, initialImagesLoaded]);

  return (
    <div
      ref={sectionRef}
      className="w-full h-[calc(100vh-150px)] hidden md:block"
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
                style={{ opacity: 0 }} // 初始设置为不可见
              >
                <figure
                  className={cn(
                    "relative h-full aspect-[2247/1500] border-background",
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
