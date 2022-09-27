import styled from "styled-components/native";

export type SpacerProps = {
  size: 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | number;
};

export const SpacerColumn = styled.View<SpacerProps>((props) => ({
  height: props.theme.layout.padding_x1 * props.size,
}));
