import getCatalogue from "@/lib/getCatalogue";
import { CatalogueType } from "@/lib/types";
import Catalogue from "@/components/cat/Catalogue";
import DesktopFooter from "@/components/footer/DesktopFooter";

const page = async () => {
  const catalogue: CatalogueType[] = await getCatalogue();
  return (
    <main className="relative">
      <Catalogue catalogue={catalogue} />
      <DesktopFooter />
    </main>
  );
};

export default page;
