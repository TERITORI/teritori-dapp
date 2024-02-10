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

export const joinElements = <ElementType, SeparatorType>(
  elements: ElementType[],
  separator: SeparatorType,
) => {
  const result: (ElementType | SeparatorType)[] = [];
  elements.forEach((e, i) => {
    result.push(e);
    if (i < elements.length - 1) {
      result.push(separator);
    }
  });
  return result;
};
