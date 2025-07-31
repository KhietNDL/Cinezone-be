import { createBucketClient } from "@cosmicjs/sdk";

interface ImportMetaEnv {
  [key: string]: string | undefined;
  VITE_COSMIC_BUCKET_SLUG?: string;
  VITE_COSMIC_READ_KEY?: string;
  VITE_COSMIC_WRITE_KEY?: string;
}

declare global {
  interface ImportMeta {
    env: ImportMetaEnv;
  }
}

if (!import.meta.env.VITE_COSMIC_BUCKET_SLUG)
  console.error(
    "Error: Environment variables missing. You need to create an environment variable file and include COSMIC_BUCKET_SLUG, COSMIC_READ_KEY, and COSMIC_WRITE_KEY environment variables."
  );

console.log("Environment variables:", {
  bucketSlug: import.meta.env.VITE_COSMIC_BUCKET_SLUG,
  readKey: import.meta.env.VITE_COSMIC_READ_KEY,
});
// Make sure to add/update your ENV variables
export const cosmic = createBucketClient({
  bucketSlug:
    import.meta.env.VITE_COSMIC_BUCKET_SLUG ||
    "You need to add your COSMIC_BUCKET_SLUG environment variable.",
  readKey:
    import.meta.env.VITE_COSMIC_READ_KEY ||
    "You need to add your COSMIC_READ_KEY environment variabl.",
  writeKey:
    import.meta.env.VITE_COSMIC_WRITE_KEY ||
    "You need to add your COSMIC_WRITE_KEY environment variable.",
});

// Example usage (remove the top-level await):
// cosmic.objects.find({"type": "movies"})
//   .limit(10)
//   .props("slug,title,metadata,type")
//   .depth(1)
