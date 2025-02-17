import { client } from "./sanity";

const getCatalogue = async () => {
  const catalogue = await client.fetch(
    `
    *[_type == "catalogue"] | order(no desc) {
      title,
        'image': image.asset._ref,
        status,
        date,
        no,
        availableAt,
        collectionAt,
        'thumbnail': thumbnail.asset._ref
    }
    `
  );
  return catalogue;
};

export default getCatalogue;
