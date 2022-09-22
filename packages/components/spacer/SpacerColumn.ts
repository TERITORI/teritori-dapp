import styled from "styled-components/native";

export const SpacerColumn = styled.View<{ numberOfSpaces: number }>(
  (props) => ({
    height: props.theme.layout.padding * props.numberOfSpaces,
  })
);
