"use client";

import { useRef, useEffect } from "react";
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
  const setCurrentImage = useCurrentImageStore(
    (state) => state.setCurrentImage
  );

  useEffect(() => {
    setCurrentImage(images[0]);
  }, [images]);

  useGSAP(() => {
    if (!sectionRef.current || !wrapperRef.current) return;

    const items = wrapperRef.current.querySelectorAll(".item");
    const viewportHeight = window.innerHeight - 150;
    const slideWidth = (viewportHeight * 2000) / 1030;
    const margin = window.innerWidth - slideWidth;
    const triggerPoint = window.innerWidth / 3;

    // 设置初始状态
    items.forEach((item, index) => {
      gsap.set(item, { x: index * slideWidth });
    });

    // 当sectionRef出现时，开始动画
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

    items.forEach((_, index) => {
      // 第一张图片保持不动
      if (index === 0) return;

      // 获取当前位置之后的所有图片，这些图片整体向左移动，当第一张图片移动到x=0时，剩下的图片整体向左移动，直到最后一张图片移动到margin位置
      const movingItems = Array.from(items).slice(index);

      //
      timeline.to(movingItems, {
        x: (i) => {
          // i 是在 movingItems 中的索引
          const targetX = i * slideWidth;
          // 确保最后一张图片不会超过margin位置
          if (i + index === items.length - 1) {
            return Math.max(margin, targetX);
          }
          return targetX;
        },
        duration: 1,
        ease: "none",
      });
    });
  });

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
                    "relative h-full aspect-[2000/1030] border-l border-background",
                    link && "cursor-pointer"
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
