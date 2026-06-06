import { headers } from "next/headers";

const DEFAULT_METICULOUS_DATE = "Fri, 17 May 2024 13:35:20 GMT";

export type MeticulousRenderingContext = {
  isMeticulousTest: boolean;
  currentTimeMs: number;
};

export async function getMeticulousRenderingContext(): Promise<MeticulousRenderingContext> {
  const requestHeaders = await headers();
  const isMeticulousTest = requestHeaders.get("meticulous-is-test") === "1";

  if (!isMeticulousTest) {
    return {
      isMeticulousTest,
      currentTimeMs: Date.now(),
    };
  }

  const simulatedDate =
    requestHeaders.get("meticulous-simulated-date") ?? DEFAULT_METICULOUS_DATE;
  const parsedDate = Date.parse(simulatedDate);

  return {
    isMeticulousTest,
    currentTimeMs: Number.isNaN(parsedDate)
      ? Date.parse(DEFAULT_METICULOUS_DATE)
      : parsedDate,
  };
}
