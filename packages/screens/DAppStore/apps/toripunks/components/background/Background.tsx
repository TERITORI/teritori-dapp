import React from "react";

import { DefaultBackground } from "./DefaultBackground";

const imgComponent = {
  comicbook: (children: JSX.Element) => (
    <DefaultBackground type="comicbook">{children}</DefaultBackground>
  ),
  "comic-book-history": (children: JSX.Element) => (
    <DefaultBackground type="comic-book-history">{children}</DefaultBackground>
  ),
  disconnect: (children: JSX.Element) => (
    <DefaultBackground type="disconnect">{children}</DefaultBackground>
  ),
  welcome: (children: JSX.Element) => (
    <DefaultBackground type="welcome">{children}</DefaultBackground>
  ),
  roulette: (children: JSX.Element) => (
    <DefaultBackground type="roulette">{children}</DefaultBackground>
  ),
  lottery: (children: JSX.Element) => (
    <DefaultBackground type="lottery">{children}</DefaultBackground>
  ),
  "lottery-history": (children: JSX.Element) => (
    <DefaultBackground type="lottery-history">{children}</DefaultBackground>
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
  "my-history": (children: JSX.Element) => (
    <DefaultBackground type="raffle">{children}</DefaultBackground>
  ),
  "menu-mobile": (children: JSX.Element) => (
    <DefaultBackground type="menu-mobile">{children}</DefaultBackground>
  ),
};

export const Background: React.FC<{ children: JSX.Element; type: string }> = ({
  children,
  type,
}) => {
  const selectedComponent = (imgComponent as any)[type];
  return selectedComponent(children);
};
