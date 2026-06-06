import { getMeticulousRenderingContext } from "@/lib/meticulous";
import StopTheStigmaContent from "./stop-the-stigma-content";

export default async function StopTheStigma() {
  const { currentTimeMs, isMeticulousTest } =
    await getMeticulousRenderingContext();

  return (
    <StopTheStigmaContent
      freezeCountdown={isMeticulousTest}
      initialNowMs={currentTimeMs}
    />
  );
}
