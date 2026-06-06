/* eslint-disable @next/next/no-sync-scripts */
const METICULOUS_RECORDING_TOKEN = "18MdcWMCkU9vPtqyoGjw2i2VfcI8EAxZVYgOe0GH";

export function MeticulousRecorder() {
  const shouldRecord =
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "preview";

  if (!shouldRecord) {
    return null;
  }

  return (
    <script
      data-recording-token={METICULOUS_RECORDING_TOKEN}
      data-is-production-environment="false"
      src="https://snippet.meticulous.ai/v1/meticulous.js"
    />
  );
}
