import styled from "styled-components/native";

export const SpacerRow = styled.View<{ numberOfSpaces: number }>((props) => ({
  width: props.theme.layout.padding * props.numberOfSpaces,
}));
