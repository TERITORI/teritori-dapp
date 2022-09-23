// libraries
import React from "react";
import { ViewStyle } from "react-native";
import styled from "styled-components/native";

type SeparatorProps = {
  style?: ViewStyle;
};

export const Separator = ({ style }: SeparatorProps) => {
  // returns
  return <Container style={style} />;
};

const Container = styled.View(({ theme: { colors } }) => ({
  backgroundColor: colors.neutral44,
  width: "100%",
  height: 1,
}));
