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
  const [windowWidth, setWindowWidth] = useState(0);
  const setCurrentImage = useCurrentImageStore(
    (state) => state.setCurrentImage
  );
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    setCurrentImage(images[0]);
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [images]);

  useGSAP(() => {
    if (!sectionRef.current || !wrapperRef.current) return;

    const items = wrapperRef.current.querySelectorAll(".item");
    const viewportHeight = window.innerHeight - 150;
    const slideWidth = (viewportHeight * 2000) / 1330;
    const margin = window.innerWidth - slideWidth;
    const triggerPoint = window.innerWidth / 3;

    // 清除现有的动画和ScrollTrigger实例
    ScrollTrigger.getAll().forEach((st) => st.kill());
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    gsap.killTweensOf(items);

    // 获取当前滚动进度
    const currentProgress = timelineRef.current?.progress() || 0;

    // 重新设置初始状态和位置
    items.forEach((item, index) => {
      const currentX = gsap.getProperty(item, "x") as number;
      const targetX = index * slideWidth;

      // 如果已经有动画在进行，根据滚动进度计算新的位置
      if (currentProgress > 0) {
        const adjustedX =
          targetX - slideWidth * currentProgress * (items.length - 1);
        gsap.set(item, { x: Math.max(margin, adjustedX) });
      } else {
        gsap.set(item, { x: targetX });
      }
    });

    // 创建新的时间线
    const timeline = gsap.timeline({
      scrollTrigger: {
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

    // 保存时间线引用
    timelineRef.current = timeline;

    items.forEach((_, index) => {
      if (index === 0) return;

      const movingItems = Array.from(items).slice(index);

      timeline.to(movingItems, {
        x: (i) => {
          const targetX = i * slideWidth;
          if (i + index === items.length - 1) {
            return Math.max(margin, targetX);
          }
          return targetX;
        },
        duration: 1,
        ease: "none",
      });
    });
  }, [images, windowWidth]); // 依赖于 windowWidth

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
              <div key={title} className="item absolute inset-0 h-full">
                <figure
                  className={cn(
                    "relative h-full aspect-[2000/1330] border-background",
                    link && "cursor-pointer",
                    index !== 0 && "border-l"
                  )}
                  onClick={() => {
                    if (link) {
                      window.open(link, "_blank");
                    }
                  }}
                >
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
