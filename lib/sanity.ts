import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "vo1wf6t4",
  dataset: "production",
  apiVersion: "2025-02-17",
  useCdn: false,
});
