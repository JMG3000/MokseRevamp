/* eslint-disable @next/next/no-sync-scripts */
export function MeticulousRecorder() {
  const projectId = process.env.NEXT_PUBLIC_METICULOUS_PROJECT_ID;

  if (!projectId) {
    return null;
  }

  return (
    <script
      data-project-id={projectId}
      src="https://snippet.meticulous.ai/v1/meticulous.js"
    />
  );
}