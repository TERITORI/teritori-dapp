import styled from "styled-components/native";

export const SpacerFlex = styled.View<{ flex?: number }>(({ flex }) => ({
  flex: flex || 1,
}));
