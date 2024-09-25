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

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends globalThis.Array<infer U>
    ? globalThis.Array<DeepPartial<U>>
    : T extends readonly (infer U)[]
      ? readonly DeepPartial<U>[]
      : T extends object
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : Partial<T>;
