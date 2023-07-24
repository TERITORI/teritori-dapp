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

export function boot(): number {
  return WeshdModule.boot();
}

export function getPort(): number {
  return WeshdModule.getPort();
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
