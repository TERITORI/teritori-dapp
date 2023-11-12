// mostly a copy of https://github.com/sindresorhus/ts-extras since it can't be resolved

type ObjectKeys<T extends object> = `${Exclude<keyof T, symbol>}`;

export const objectKeys = Object.keys as <Type extends object>(
  value: Type,
) => ObjectKeys<Type>[];

export function arrayIncludes<Type extends SuperType, SuperType = unknown>(
  array: Type[] | readonly Type[],
  item: SuperType,
  fromIndex?: number,
): item is Type {
  return array.includes(item as Type, fromIndex);
}
