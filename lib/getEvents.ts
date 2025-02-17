import { client } from "./sanity";

const getEvents = async () => {
  const events = await client.fetch(
    `
    *[_type == "events"] | order(date desc) {
      date,
        description
    }
    `
  );
  return events;
};

export default getEvents;
