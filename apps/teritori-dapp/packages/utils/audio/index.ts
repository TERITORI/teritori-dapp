export * from "./waveform";
export * from "./constants";

const BAR_MAX_HEIGHT = 18;
export const generateBars = (bars: number[]) => {
  const barMax = Math.max(...bars);
  const newBars = bars.map((item) => (item / barMax) * BAR_MAX_HEIGHT);
  return newBars;
};
