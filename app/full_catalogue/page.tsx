import getCatalogue from "@/lib/getCatalogue";
import { CatalogueType } from "@/lib/types";
import Catalogue from "@/components/cat/Catalogue";
import DesktopFooter from "@/components/footer/DesktopFooter";
import MobileFooter from "@/components/footer/MobileFooter";

const page = async () => {
  const catalogue: CatalogueType[] = await getCatalogue();
  return (
    <main className="relative">
      <Catalogue catalogue={catalogue} />
      <DesktopFooter />
      <MobileFooter />
    </main>
  );
};

export default page;
