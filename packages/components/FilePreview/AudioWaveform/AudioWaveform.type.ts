import { ViewStyle } from "react-native";

export interface AudioWaveformProps {
  waveform: number[];
  positionPercent: number;
  style?: ViewStyle;
  duration: number;
  currentDuration: number;
  waveFormContainerWidth: number;
}
