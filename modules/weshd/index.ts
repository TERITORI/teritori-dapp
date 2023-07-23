import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

// Import the native module. On web, it will be resolved to Weshd.web.ts
// and on native platforms to Weshd.ts
import { ChangeEventPayload, WeshdViewProps } from "./src/Weshd.types";
import WeshdModule from "./src/WeshdModule";
import WeshdView from "./src/WeshdView";

// Get the native constant value.
export const PI = WeshdModule.PI;

export function hello(): string {
  return WeshdModule.hello();
}

export async function setValueAsync(value: string) {
  return await WeshdModule.setValueAsync(value);
}

const emitter = new EventEmitter(WeshdModule ?? NativeModulesProxy.Weshd);

export function addChangeListener(
  listener: (event: ChangeEventPayload) => void
): Subscription {
  return emitter.addListener<ChangeEventPayload>("onChange", listener);
}

export { WeshdView, WeshdViewProps, ChangeEventPayload };
