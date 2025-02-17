import getCatalogue from "@/lib/getCatalogue";
import ImageSlider from "@/components/ImageSlider";
import { CatalogueType } from "@/lib/types";

export default async function Home() {
  const catalogue: CatalogueType[] = await getCatalogue();

  return (
    <main>
      <ImageSlider catalogue={catalogue} />
    </main>
  );
}
