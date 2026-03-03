import fs from "fs";
import path from "path";
import matter from "gray-matter";
import algoliasearch from "algoliasearch";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");
const SITE_URL = "https://tubone-project24.xyz";

const appId = process.env.PUBLIC_ALGOLIA_APP_ID;
const adminKey = process.env.PUBLIC_ALGOLIA_ADMIN_API_KEY;
const indexName = process.env.PUBLIC_ALGOLIA_INDEX_NAME || "posts";

if (!appId || !adminKey) {
  console.warn(
    "Algolia credentials not set (PUBLIC_ALGOLIA_APP_ID / PUBLIC_ALGOLIA_ADMIN_API_KEY). Skipping indexing.",
  );
  process.exit(0);
}

function getRecords() {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const records = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data } = matter(raw);

    if (data.templateKey && data.templateKey !== "blog-post") {
      continue;
    }

    const slug = data.slug || file.replace(/\.md$/, "");

    records.push({
      objectID: slug,
      title: data.title || "",
      description: data.description || "",
      url: `${SITE_URL}/${slug}/`,
      date: data.date ? new Date(data.date).toISOString() : "",
      tags: data.tags || [],
    });
  }

  return records;
}

async function main() {
  try {
    const records = getRecords();
    console.log(`Found ${records.length} blog posts to index.`);

    const client = algoliasearch(appId, adminKey);
    const index = client.initIndex(indexName);

    await index.replaceAllObjects(records, {
      autoGenerateObjectIDIfNotExist: false,
      safe: true,
    });

    console.log(
      `Successfully indexed ${records.length} records to Algolia (index: ${indexName}).`,
    );
  } catch (error) {
    console.error("Algolia indexing failed:", error.message);
    console.error(
      "Continuing without failing the build.",
    );
    process.exit(0);
  }
}

main();
