import styled from "styled-components/native";

import { SpacerProps } from "./SpacerColumn";

export const SpacerRow = styled.View<SpacerProps>((props) => ({
  width: props.theme.layout.padding_x1 * props.size,
}));
