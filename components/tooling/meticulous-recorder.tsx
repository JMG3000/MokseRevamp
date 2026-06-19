/* eslint-disable @next/next/no-sync-scripts */
const FALLBACK_METICULOUS_RECORDING_TOKEN =
  "18MdcWMCkU9vPtqyoGjw2i2VfcI8EAxZVYgOe0GH";

export function MeticulousRecorder() {
  const recordingToken =
    process.env.NEXT_PUBLIC_METICULOUS_PROJECT_ID ??
    FALLBACK_METICULOUS_RECORDING_TOKEN;
  const recorderEnabled =
    process.env.NEXT_PUBLIC_ENABLE_METICULOUS_RECORDER === "1" ||
    process.env.NEXT_PUBLIC_ENABLE_METICULOUS_RECORDER === "true";
  const shouldRecord =
    recorderEnabled &&
    (process.env.NODE_ENV === "development" ||
      process.env.VERCEL_ENV === "preview");

  if (!shouldRecord || !recordingToken) {
    return null;
  }

  return (
    <script
      data-project-id={recordingToken}
      data-recording-token={recordingToken}
      data-is-production-environment="false"
      src="https://snippet.meticulous.ai/v1/meticulous.js"
    />
  );
}
