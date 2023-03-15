import React from "react";

import { DefaultBackground } from "./DefaultBackground";

const imgComponent = {
  comicgood: () => null,
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
  raffle: () => null,
};

export const Background: React.FC<{ children: JSX.Element; type: string }> = ({
  children,
  type,
}) => {
  const selectedComponnet = (imgComponent as any)[type];
  return selectedComponnet(children);
};
