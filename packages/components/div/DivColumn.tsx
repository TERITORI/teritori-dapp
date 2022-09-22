// libraries
import { ViewStyle } from "react-native";
import styled from "styled-components/native";

export interface DivProps extends ViewStyle {
  jc?: ViewStyle["justifyContent"];
  ai?: ViewStyle["alignItems"];
}

export const DivColumn = styled.View<DivProps>(({ jc, ai, flex, height }) => ({
  flexDirection: "column",
  justifyContent: jc,
  alignItems: ai,
  flex,
  height,
}));
