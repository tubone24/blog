import config from "../config/index.json";

export const SITE_URL = config.siteUrl;

export function xmlEscape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split("T")[0];
}
