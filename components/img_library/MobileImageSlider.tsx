"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { ImageType } from "@/lib/types";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import { useCurrentImageStore } from "@/lib/store/currentImage";

gsap.registerPlugin(useGSAP, Draggable);

const MobileImageSlider = ({ images }: { images: ImageType[] }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
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
    const slideWidth = (viewportHeight * 2247) / 1500;
    const margin = dimensions.width - slideWidth;

    // 清除现有动画
    if (draggableRef.current) {
      draggableRef.current.kill();
    }

    // 设置初始位置
    items.forEach((item, index) => {
      gsap.set(item, { x: index * slideWidth });
    });

    // 创建 Draggable 实例
    draggableRef.current = Draggable.create(wrapperRef.current, {
      type: "x",
      inertia: true,
      bounds: { minX: -slideWidth * (items.length - 1), maxX: 0 },
      onDrag: function () {},
    })[0];

    return () => {
      if (draggableRef.current) {
        draggableRef.current.kill();
      }
    };
  }, [images, dimensions]); // 依赖于 dimensions

  return (
    <div
      ref={sectionRef}
      className="w-full h-[calc(100vh-130px)] block md:hidden"
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

export default MobileImageSlider;
