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

  useGSAP(() => {
    if (!sectionRef.current || !wrapperRef.current) return;

    const items = wrapperRef.current.querySelectorAll(".item");
    const viewportHeight = dimensions.height - 150;
    const slideWidth = (viewportHeight * 2000) / 1330;
    const margin = dimensions.width - slideWidth;
    const triggerPoint = dimensions.width / 3;

    // 清除现有动画
    ScrollTrigger.getAll().forEach((st) => st.kill());
    if (timelineRef.current) timelineRef.current.kill();
    gsap.killTweensOf(items);

    // 获取当前进度并重置位置
    const currentProgress = timelineRef.current?.progress() || 0;
    items.forEach((item, index) => {
      if (index === 0) {
        gsap.set(item, { x: 0 }); // 第一张图片固定在 x=0
        return;
      }
      const targetX = index * slideWidth;
      const adjustedX =
        currentProgress > 0
          ? targetX - slideWidth * currentProgress * (items.length - 1)
          : targetX;
      gsap.set(item, { x: Math.max(margin, adjustedX) });
    });

    // 创建新时间线
    timelineRef.current = gsap.timeline({
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

    // 添加动画
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
  }, [images, dimensions]); // 依赖于 dimensions

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
