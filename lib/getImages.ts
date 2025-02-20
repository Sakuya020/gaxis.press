import { client } from "./sanity";

const getImages = async () => {
  const images = await client.fetch(
    `
     *[_type == "catalogue" && status != "coming soon"] | order(no desc) {
      title,
        'image': image.asset._ref,
        status,
        link,
    }
    `
  );
  return images;
};

export default getImages;
