import getCatalogue from "@/lib/getCatalogue";
import { Catalogue } from "@/lib/types";
import CatalogueLine from "@/components/CatalogueLine";

const page = async () => {
  const catalogue: Catalogue[] = await getCatalogue();
  return (
    <main>
      {catalogue.map((item) => {
        return <CatalogueLine key={item.no} item={item} />;
      })}
    </main>
  );
};

export default page;
