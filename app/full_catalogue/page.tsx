import getCatalogue from "@/lib/getCatalogue";
import { CatalogueType } from "@/lib/types";
import Catalogue from "@/components/cat/Catalogue";

const page = async () => {
  const catalogue: CatalogueType[] = await getCatalogue();
  return <Catalogue catalogue={catalogue} />;
};

export default page;
