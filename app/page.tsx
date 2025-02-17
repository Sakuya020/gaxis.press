import getCatalogue from "@/lib/getCatalogue";
import ImageSlider from "@/components/ImageSlider";
import { Catalogue } from "@/lib/types";

export default async function Home() {
  const catalogue: Catalogue[] = await getCatalogue();

  return (
    <main>
      <ImageSlider catalogue={catalogue} />
    </main>
  );
}
