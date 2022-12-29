import React, { ComponentType } from "react";

import { DEFAULT_USERNAME } from "./social-feed";

export const capitalize = (s: string) =>
  (s && s[0].toUpperCase() + s.slice(1)) || "";

export const thousandSeparator = (
  value: string | number,
  seperator: string
) => {
  const valueArray = value.toString().split(".");
  const thosandSeperatedValue = valueArray[0]
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, seperator);

  return thosandSeperatedValue + (valueArray[1] ? `.${valueArray[1]}` : "");
};

export const replaceBetweenString = (
  origin: string,
  startIndex: number,
  endIndex: number,
  insertion: string
) =>
  `${origin.substring(0, startIndex)}${insertion}${origin.substring(endIndex)}`;

export const replaceTextWithComponent = (
  text: string,
  regex: RegExp,
  Renderer: ComponentType<{ match: string }>
) => {
  const textArray = text.split(regex);
  return textArray.map((str) => {
    if (regex.test(str) && str.toLowerCase() !== `@${DEFAULT_USERNAME}`) {
      return <Renderer match={str} />;
    }
    return str;
  });
};
