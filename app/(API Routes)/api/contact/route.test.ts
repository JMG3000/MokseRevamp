import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/server before importing the route
vi.mock("next/server", () => {
  class MockNextRequest {
    private _request: Request;

    constructor(input: Request | string, init?: RequestInit) {
      this._request = typeof input === "string" ? new Request(input, init) : input;
    }

    async json() {
      return this._request.json();
    }

    get url() {
      return this._request.url;
    }

    get method() {
      return this._request.method;
    }

    get headers() {
      return this._request.headers;
    }
  }

  class MockNextResponse {
    readonly body: unknown;
    readonly status: number;
    readonly headers: Headers;

    constructor(body: unknown, init?: ResponseInit) {
      this.body = body;
      this.status = init?.status ?? 200;
      this.headers = new Headers(init?.headers);
    }

    static json(
      body: unknown,
      init?: ResponseInit
    ): MockNextResponse {
      return new MockNextResponse(body, init);
    }

    async json() {
      return this.body;
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: MockNextResponse,
  };
});

import { NextRequest, NextResponse } from "next/server";
import { POST } from "./route";

function makeNextRequest(body: unknown): NextRequest {
  const request = new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return new NextRequest(request);
}

describe("POST /api/contact", () => {
  it("returns 200 with success message when all required fields are provided", async () => {
    const request = makeNextRequest({
      name: "John Doe",
      email: "john@example.com",
      subject: "Hello",
      message: "This is a test message",
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ message: "Contact form submitted successfully" });
  });

  it("returns 400 when all required fields are missing", async () => {
    const request = makeNextRequest({});

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Missing required fields");
    expect(data.missingFields).toContain("name");
    expect(data.missingFields).toContain("email");
    expect(data.missingFields).toContain("subject");
    expect(data.missingFields).toContain("message");
  });

  it("returns 400 with the list of missing fields when name is missing", async () => {
    const request = makeNextRequest({
      email: "john@example.com",
      subject: "Hello",
      message: "Test message",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Missing required fields");
    expect(data.missingFields).toEqual(["name"]);
  });

  it("returns 400 when email is missing", async () => {
    const request = makeNextRequest({
      name: "John Doe",
      subject: "Hello",
      message: "Test message",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.missingFields).toEqual(["email"]);
  });

  it("returns 400 when subject is missing", async () => {
    const request = makeNextRequest({
      name: "John Doe",
      email: "john@example.com",
      message: "Test message",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.missingFields).toEqual(["subject"]);
  });

  it("returns 400 when message is missing", async () => {
    const request = makeNextRequest({
      name: "John Doe",
      email: "john@example.com",
      subject: "Hello",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.missingFields).toEqual(["message"]);
  });

  it("returns 400 when multiple specific fields are missing", async () => {
    const request = makeNextRequest({
      name: "John Doe",
      email: "john@example.com",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.missingFields).toHaveLength(2);
    expect(data.missingFields).toContain("subject");
    expect(data.missingFields).toContain("message");
  });

  it("returns 400 when a field is an empty string (falsy)", async () => {
    const request = makeNextRequest({
      name: "",
      email: "john@example.com",
      subject: "Hello",
      message: "Test message",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.missingFields).toContain("name");
  });

  it("returns 400 when fields contain only falsy values like 0", async () => {
    const request = makeNextRequest({
      name: 0,
      email: "john@example.com",
      subject: "Hello",
      message: "Test message",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    // 0 is falsy so it should be flagged as missing
    expect(data.missingFields).toContain("name");
  });

  it("returns 500 when request body is not valid JSON", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const badRequest = new NextRequest(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "this is not valid json{{{",
      })
    );

    const response = await POST(badRequest);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Failed to process contact form submission");
    consoleSpy.mockRestore();
  });

  it("returns a NextResponse instance", async () => {
    const request = makeNextRequest({
      name: "Jane",
      email: "jane@example.com",
      subject: "Inquiry",
      message: "Hello there!",
    });

    const response = await POST(request);

    expect(response).toBeInstanceOf(NextResponse);
  });

  it("returns 400 error response that includes both error and missingFields keys", async () => {
    const request = makeNextRequest({ name: "Only Name" });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Missing required fields");
    expect(data).toHaveProperty("missingFields");
    expect(Array.isArray(data.missingFields)).toBe(true);
  });

  it("accepts extra fields beyond the required ones and still succeeds", async () => {
    const request = makeNextRequest({
      name: "John Doe",
      email: "john@example.com",
      subject: "Hello",
      message: "Test message",
      phone: "555-1234",
      extraField: "extra value",
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe("Contact form submitted successfully");
  });

  it("preserves the order of missingFields matching the required fields order", async () => {
    const request = makeNextRequest({});

    const response = await POST(request);

    const data = await response.json();
    expect(data.missingFields).toEqual(["name", "email", "subject", "message"]);
  });

  it("logs error to console when an exception is thrown", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const badRequest = new NextRequest(
      new Request("http://localhost/api/contact", {
        method: "POST",
        body: "invalid json!!!",
      })
    );

    await POST(badRequest);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error processing contact form:",
      expect.anything()
    );
    consoleSpy.mockRestore();
  });
});