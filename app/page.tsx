import ImageSlider from "@/components/img_library/ImageSlider";
import { ImageType } from "@/lib/types";
import getImages from "@/lib/getImages";

export default async function Home() {
  const images: ImageType[] = await getImages();

  return (
    <main>
      <ImageSlider images={images} />
    </main>
  );
}
