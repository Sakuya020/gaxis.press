import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { CatalogueType } from "@/lib/types";

const ImageSlider = ({ catalogue }: { catalogue: CatalogueType[] }) => {
  return (
    <ul className="flex">
      {catalogue.map((item) => {
        const { title, image, status, no } = item;
        if (status === "sold out" || !image) return null;
        const imgUrl = getImageUrl(image);
        return (
          <li
            key={no}
            className="relative h-[calc(100vh-166.5px)] aspect-[2000/1030]"
          >
            <Image src={imgUrl} alt={title} fill />
          </li>
        );
      })}
    </ul>
  );
};

export default ImageSlider;
