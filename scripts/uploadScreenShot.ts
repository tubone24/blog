import { encode } from "https://deno.land/std/encoding/base64.ts";

const GITHUB_API_URL = "https://api.github.com";
const AUTHOR_NAME = "github-actions[bot]";
const AUTHOR_EMAIL = "github-actions[bot]@users.noreply.github.com";
const filePath = Deno.env.get("FILE_PATH") as string;
const fileName = Deno.env.get("FILE_NAME") as string;
const gitHubToken = Deno.env.get("GITHUB_TOKEN") as string;
const gitHubRepo = Deno.env.get("GITHUB_REPOSITORY") as string;
const prNumber = Deno.env.get("GITHUB_PULL_REQUEST_NUMBER") as string;
const branchName = Deno.env.get("BRANCH_NAME") as string;

const readImageData = await Deno.readFile(filePath);
const encodedData = encode(readImageData);

const gitHubPayload = {
  message: `[file upload] Added file for PR #${prNumber}`,
  content: encodedData.replace(new RegExp("data.*base64,"), ""),
  branch: branchName,
  author: {
    name: AUTHOR_NAME,
    email: AUTHOR_EMAIL,
  },
  committer: {
    name: AUTHOR_NAME,
    email: AUTHOR_EMAIL,
  },
};

const gitHubHeaders = {
  Accept: "application/vnd.github.v3+json",
  Authorization: `Bearer ${gitHubToken}`,
};

const gitHubUploadurl = `${GITHUB_API_URL}/repos/${gitHubRepo}/contents/file-uploader/${fileName}`;

const gitHubRes = await fetch(gitHubUploadurl, {
  method: "PUT",
  headers: gitHubHeaders,
  body: JSON.stringify(gitHubPayload),
});

// const gitHubJson = gitHubRes.json();
// const { data: gitHubData } = await gitHubJson;
// const imgurLink = gitHubData.link;

console.log(gitHubRes);
