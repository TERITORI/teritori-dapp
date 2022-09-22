// libraries
import styled from "styled-components/native";

import { DivProps } from "./DivColumn";

export const DivRow = styled.View<DivProps>(({ jc, ai, flex, height }) => ({
  flexDirection: "row",
  justifyContent: jc,
  alignItems: ai || "center",
  flex,
  height,
}));
