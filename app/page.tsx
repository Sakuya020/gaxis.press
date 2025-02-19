import ImageSlider from "@/components/img_library/ImageSlider";
import { ImageType } from "@/lib/types";
import getImages from "@/lib/getImages";
import MobileImageSlider from "@/components/img_library/MobileImageSlider";

export default async function Home() {
  const images: ImageType[] = await getImages();

  return (
    <main>
      <ImageSlider images={images} />
      <MobileImageSlider images={images} />
    </main>
  );
}
