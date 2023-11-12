import { Children, ReactNode, isValidElement } from "react";

export const getReactNodeStringProp = (
  node: ReactNode,
  propName: string,
): string => {
  const children = Children.toArray(node);
  if (children.length < 1) {
    return "";
  }
  const child = children[0];
  if (!isValidElement(child)) {
    return "";
  }
  const value = child.props[propName];
  if (typeof value !== "string") {
    return "";
  }
  return value;
};
