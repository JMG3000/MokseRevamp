import { unstable_cache } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const NOTION_API_VERSION = "2022-06-28";
const NOTION_CACHE_SECONDS = 60 * 60;
const NOTION_TIMEOUT_MS = 10_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const RATE_LIMIT_CLEANUP_THRESHOLD = 1_000;
const RATE_LIMIT_MAX_CLEANUP_PER_REQUEST = 50;
const RATE_LIMIT_MAX_CLEANUP_ITERATIONS = 200;

type NotionRichText = { plain_text?: string };
type NotionTitle = { text?: { content?: string }; plain_text?: string };
type NotionSelect = { name?: string };
type NotionDateProperty = { date?: { start?: string } | null };
type NotionUrlProperty = { url?: string | null };
type NotionNumberProperty = { number?: number | null };
type NotionTextProperty = { rich_text?: NotionRichText[] };
type NotionTitleProperty = { title?: NotionTitle[] };
type NotionMultiSelectProperty = { multi_select?: NotionSelect[] };
type NotionFile = {
  file?: { url?: string };
  external?: { url?: string };
};
type NotionFilesProperty = { files?: NotionFile[] };

type NotionProperties = {
  "Verification Date"?: NotionDateProperty;
  verificationDate?: NotionDateProperty;
  region?: NotionMultiSelectProperty;
  category?: NotionMultiSelectProperty;
  id?: NotionNumberProperty;
  description?: NotionTextProperty;
  Link?: NotionUrlProperty;
  "url ( link )"?: NotionUrlProperty;
  WebLogoURL?: NotionFilesProperty;
  Name?: NotionTitleProperty;
};

type NotionDatabaseEntry = {
  properties: NotionProperties;
};

type NotionQueryResponse = {
  results?: NotionDatabaseEntry[];
};

type ResourcePayload = {
  verificationDate: string;
  region: string[];
  category: string[];
  id: number;
  description: string;
  WebLogoURL: string | null;
  url: string;
  title: string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

class NotionFetchError extends Error {
  constructor(
    message: string,
    readonly status = 502,
  ) {
    super(message);
  }
}

// This protects a single serverless/Node instance. Use Vercel Firewall,
// Upstash, Redis, or another shared atomic store for global enforcement.
const notionRateLimits =
  (globalThis as typeof globalThis & {
    __mokseNotionRateLimits?: Map<string, RateLimitEntry>;
  }).__mokseNotionRateLimits ?? new Map<string, RateLimitEntry>();

(globalThis as typeof globalThis & {
  __mokseNotionRateLimits?: Map<string, RateLimitEntry>;
}).__mokseNotionRateLimits = notionRateLimits;

const getText = (items: NotionRichText[] | undefined) =>
  items?.map((item) => item.plain_text ?? "").join(" ").trim() ?? "";

const getTitle = (items: NotionTitle[] | undefined) =>
  items
    ?.map((item) => item.plain_text ?? item.text?.content ?? "")
    .join(" ")
    .trim() ?? "";

const getMultiSelect = (items: NotionSelect[] | undefined) =>
  items?.map((item) => item.name).filter((name): name is string => Boolean(name)) ?? [];

const getFileUrl = (files: NotionFile[] | undefined) => {
  const firstFile = files?.[0];
  return firstFile?.file?.url ?? firstFile?.external?.url ?? null;
};

const getVerificationDate = (properties: NotionProperties) =>
  properties["Verification Date"]?.date?.start ??
  properties.verificationDate?.date?.start ??
  "";

const getResourceLink = (properties: NotionProperties) =>
  properties.Link?.url ?? properties["url ( link )"]?.url ?? "";

const mapNotionEntry = (entry: NotionDatabaseEntry): ResourcePayload => {
  const properties = entry.properties;

  return {
    verificationDate: getVerificationDate(properties),
    region: getMultiSelect(properties.region?.multi_select),
    category: getMultiSelect(properties.category?.multi_select),
    id: properties.id?.number ?? 1000,
    description: getText(properties.description?.rich_text),
    WebLogoURL: getFileUrl(properties.WebLogoURL?.files),
    url: getResourceLink(properties),
    title: getTitle(properties.Name?.title),
  };
};

const getRateLimitKey = (request: NextRequest) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  request.headers.get("x-real-ip") ??
  "local";

const checkRateLimit = (request: NextRequest) => {
  const now = Date.now();
  const key = getRateLimitKey(request);

  if (notionRateLimits.size > RATE_LIMIT_CLEANUP_THRESHOLD) {
    let deleted = 0;
    let checked = 0;

    for (const [entryKey, entry] of notionRateLimits.entries()) {
      if (checked >= RATE_LIMIT_MAX_CLEANUP_ITERATIONS) {
        break;
      }

      checked += 1;

      if (entry.resetAt <= now) {
        notionRateLimits.delete(entryKey);
        deleted += 1;
      }

      if (deleted >= RATE_LIMIT_MAX_CLEANUP_PER_REQUEST) {
        break;
      }
    }
  }

  const current = notionRateLimits.get(key);

  if (!current || current.resetAt <= now) {
    notionRateLimits.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return null;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return Math.ceil((current.resetAt - now) / 1000);
  }

  current.count += 1;
  return null;
};

const fetchNotionResources = unstable_cache(
  async (): Promise<ResourcePayload[]> => {
    const databaseId = process.env.NOTION_DATABASE_KEY;
    const token = process.env.NOTION_TOKEN;
    const baseUrl = process.env.NOTION_BASE_URL ?? "https://api.notion.com/v1/";

    if (!databaseId || !token) {
      throw new NotionFetchError("Notion database ID or token is not configured", 500);
    }

    const endpoint = `${baseUrl.replace(/\/+$/, "")}/databases/${databaseId}/query`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
        "Notion-Version": NOTION_API_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
      signal: AbortSignal.timeout(NOTION_TIMEOUT_MS),
    });

    if (!response.ok) {
      let notionError: { code?: string; message?: string } = {};

      try {
        notionError = await response.json();
      } catch {
        notionError = { message: response.statusText };
      }

      console.error("Notion API request failed", {
        status: response.status,
        code: notionError.code,
        message: notionError.message,
      });

      throw new NotionFetchError("Notion API request failed", response.status);
    }

    const data = (await response.json()) as NotionQueryResponse;
    return (data.results ?? []).map(mapNotionEntry);
  },
  ["notion-resource-database"],
  {
    revalidate: NOTION_CACHE_SECONDS,
    tags: ["notion-resources"],
  },
);

async function handleRequest(request: NextRequest) {
  const retryAfter = checkRateLimit(request);

  if (retryAfter !== null) {
    return NextResponse.json(
      { error: "Too many resource requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
        },
      },
    );
  }

  try {
    const payload = await fetchNotionResources();

    return NextResponse.json(
      {
        message: "Notion database fetched successfully",
        payload,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": `s-maxage=${NOTION_CACHE_SECONDS}, stale-while-revalidate=${NOTION_CACHE_SECONDS}`,
        },
      },
    );
  } catch (error) {
    const status = error instanceof NotionFetchError ? error.status : 500;

    console.error("Failed to serve Notion resources", {
      status,
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      { error: "Resource data is temporarily unavailable" },
      { status: status >= 400 && status < 600 ? status : 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}
