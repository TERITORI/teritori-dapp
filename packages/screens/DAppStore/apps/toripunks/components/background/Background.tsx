import React from "react";

import { DefaultBackground } from "./DefaultBackground";

const imgComponent = {
  comicgood: (children: JSX.Element) => (
    <DefaultBackground type="comicgood">{children}</DefaultBackground>
  ),
  disconnect: (children: JSX.Element) => (
    <DefaultBackground type="disconnect">{children}</DefaultBackground>
  ),
  login: (children: JSX.Element) => (
    <DefaultBackground type="login">{children}</DefaultBackground>
  ),
  main: (children: JSX.Element) => (
    <DefaultBackground type="main">{children}</DefaultBackground>
  ),
  price: (children: JSX.Element) => (
    <DefaultBackground type="price">{children}</DefaultBackground>
  ),
  pricepool: () => null,
  score: (children: JSX.Element) => (
    <DefaultBackground type="score">{children}</DefaultBackground>
  ),
  winorlose: (children: JSX.Element) => (
    <DefaultBackground type="winorlose">{children}</DefaultBackground>
  ),
  raffle: (children: JSX.Element) => (
    <DefaultBackground type="raffle">{children}</DefaultBackground>
  ),
};

export const Background: React.FC<{ children: JSX.Element; type: string }> = ({
  children,
  type,
}) => {
  const selectedComponnet = (imgComponent as any)[type];
  return selectedComponnet(children);
};
