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

export const isFloatText = (value: string) => {
  const regOnlyFloats = new RegExp(/^([0-9]*[.])?[0-9]+$|^([0-9]*[.])$/);
  return regOnlyFloats.test(value) && value !== ".";
};

export const tinyAddress = (
  fullAddress: string = "",
  totalCount: number = 10
) => {
  if (fullAddress.length <= 13) {
    return fullAddress;
  }
  const chainIdReg = fullAddress.match(/.+?(?=\d+)/);
  const chainIdName = chainIdReg?.length ? chainIdReg[0] : "";
  const startingCharLength =
    Math.ceil(totalCount / 2) - chainIdName?.length / 2;
  const endingCharLength = Math.floor(totalCount / 2) - chainIdName?.length / 2;

  return `${fullAddress.substring(
    0,
    startingCharLength + chainIdName.length
  )}...${fullAddress.substring(fullAddress.length - endingCharLength)}`;
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

export const pluralOrNot = (word: string, quantity: number) =>
  quantity > 1 ? word + "s" : word;

export function numFormatter(
  num: number | undefined | string,
  digits: number | undefined
) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      // @ts-expect-error
      return num >= item.value;
    });

  return item
    ? // @ts-expect-error
      (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
}
