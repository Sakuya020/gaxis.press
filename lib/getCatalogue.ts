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
        collectionAt
    }
    `
  );
  return catalogue;
};

export default getCatalogue;
