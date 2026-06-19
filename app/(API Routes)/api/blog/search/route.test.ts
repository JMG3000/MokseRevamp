import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fs and path before importing the route
vi.mock("fs");
vi.mock("path");

import * as fs from "fs";
import * as path from "path";
import { GET } from "./route";

const MOCK_BLOGS = [
  {
    id: 1,
    dateFull: "2025-12-29T12:00:00Z",
    dateY: 2025,
    dateM: 12,
    dateD: 29,
    title: "Sample Blog Post 1",
    description: "Description 1",
    files: ["src/app/about-us/page.tsx"],
  },
  {
    id: 2,
    dateFull: "2025-12-30T12:00:00Z",
    dateY: 2025,
    dateM: 12,
    dateD: 30,
    title: "Sample Blog Post 2",
    description: "Description 2",
    files: ["src/app/about-us/page.tsx"],
  },
  {
    id: 3,
    dateFull: "2025-12-31T12:00:00Z",
    dateY: 2025,
    dateM: 12,
    dateD: 31,
    title: "Another Article",
    description: "Description 3",
    files: ["src/app/about-us/page.tsx"],
  },
  {
    id: 4,
    dateFull: "2026-01-01T14:30:00Z",
    dateY: 2026,
    dateM: 1,
    dateD: 1,
    title: "UPPERCASE TITLE",
    description: "Description 4",
    files: ["src/app/about-us/page.tsx"],
  },
];

function makeRequest(query?: string): Request {
  const url = query
    ? `http://localhost/api/blog/search?q=${encodeURIComponent(query)}`
    : "http://localhost/api/blog/search";
  return new Request(url);
}

beforeEach(() => {
  vi.mocked(path.join).mockReturnValue("/mocked/path/blogs.json");
  vi.mocked(fs.readFileSync).mockReturnValue(
    JSON.stringify(MOCK_BLOGS) as unknown as Buffer
  );
});

describe("GET /api/blog/search", () => {
  it("returns all blogs when no query parameter is provided", async () => {
    const request = makeRequest();
    const response = GET(request);

    expect(response).toBeInstanceOf(Response);
    const data = await (response as Response).json();
    expect(data).toHaveLength(MOCK_BLOGS.length);
  });

  it("returns all blogs when query parameter is empty string", async () => {
    const request = makeRequest("");
    const response = GET(request);

    const data = await (response as Response).json();
    expect(data).toHaveLength(MOCK_BLOGS.length);
  });

  it("filters blogs by title containing the query (case-insensitive)", async () => {
    const request = makeRequest("sample blog");
    const response = GET(request);

    const data = await (response as Response).json();
    expect(data).toHaveLength(2);
    expect(data[0].title).toBe("Sample Blog Post 1");
    expect(data[1].title).toBe("Sample Blog Post 2");
  });

  it("filters blogs case-insensitively when query is uppercase", async () => {
    const request = makeRequest("SAMPLE BLOG");
    const response = GET(request);

    const data = await (response as Response).json();
    expect(data).toHaveLength(2);
  });

  it("filters blogs case-insensitively when title is uppercase and query is lowercase", async () => {
    const request = makeRequest("uppercase");
    const response = GET(request);

    const data = await (response as Response).json();
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe("UPPERCASE TITLE");
  });

  it("returns empty array when no blog matches the query", async () => {
    const request = makeRequest("nonexistent-xyz-query");
    const response = GET(request);

    const data = await (response as Response).json();
    expect(data).toHaveLength(0);
    expect(Array.isArray(data)).toBe(true);
  });

  it("returns a single matching blog when query matches exactly one", async () => {
    const request = makeRequest("another");
    const response = GET(request);

    const data = await (response as Response).json();
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe("Another Article");
  });

  it("constructs the data file path using process.cwd and correct path segments", () => {
    const request = makeRequest("test");
    GET(request);

    expect(path.join).toHaveBeenCalledWith(
      process.cwd(),
      "app",
      "(API Routes)",
      "api",
      "data",
      "blogs.json"
    );
  });

  it("reads the blogs.json file from the resolved path", () => {
    const request = makeRequest("test");
    GET(request);

    expect(fs.readFileSync).toHaveBeenCalledWith(
      "/mocked/path/blogs.json",
      "utf8"
    );
  });

  it("returns a Response object", () => {
    const request = makeRequest("post");
    const response = GET(request);

    expect(response).toBeInstanceOf(Response);
  });

  it("returns the complete blog object structure for matching results", async () => {
    const request = makeRequest("blog post 1");
    const response = GET(request);

    const data = await (response as Response).json();
    expect(data).toHaveLength(1);
    const blog = data[0];
    expect(blog).toHaveProperty("id", 1);
    expect(blog).toHaveProperty("title", "Sample Blog Post 1");
    expect(blog).toHaveProperty("dateFull");
    expect(blog).toHaveProperty("dateY");
    expect(blog).toHaveProperty("dateM");
    expect(blog).toHaveProperty("dateD");
    expect(blog).toHaveProperty("description");
    expect(blog).toHaveProperty("files");
  });

  it("handles partial title match correctly", async () => {
    const request = makeRequest("post");
    const response = GET(request);

    const data = await (response as Response).json();
    // "Sample Blog Post 1", "Sample Blog Post 2" both match "post"
    expect(data.length).toBeGreaterThanOrEqual(2);
    expect(data.every((b: { title: string }) =>
      b.title.toLowerCase().includes("post")
    )).toBe(true);
  });

  it("handles special regex characters in query as plain substring search", async () => {
    // The implementation uses String.includes(), not regex, so special characters
    // are treated as literal characters and should not throw
    const request = makeRequest("blog.post");
    const response = GET(request);

    const data = await (response as Response).json();
    // No title contains "blog.post" literally
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(0);
  });

  it("returns empty array when all blogs are present but none match query", async () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce(
      JSON.stringify([
        { id: 99, title: "Completely Different", description: "x", files: [] },
      ]) as unknown as Buffer
    );

    const request = makeRequest("blog post");
    const response = GET(request);

    const data = await (response as Response).json();
    expect(data).toHaveLength(0);
  });

  it("handles empty blogs array from JSON file", async () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce(
      JSON.stringify([]) as unknown as Buffer
    );

    const request = makeRequest("sample");
    const response = GET(request);

    const data = await (response as Response).json();
    expect(data).toHaveLength(0);
    expect(Array.isArray(data)).toBe(true);
  });
});