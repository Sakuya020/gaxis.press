import { client } from "./sanity";

const getImages = async () => {
  const images = await client.fetch(
    `
     *[_type == "catalogue" && image.asset._ref != null] | order(no desc) {
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
