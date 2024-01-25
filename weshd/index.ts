// Import the native module. On web, it will be resolved to Weshd.web.ts
// and on native platforms to Weshd.ts
import { ChangeEventPayload, WeshdViewProps } from "./src/Weshd.types";
import WeshdModule from "./src/WeshdModule";
import WeshdView from "./src/WeshdView";

export function boot(): number {
  return WeshdModule.boot();
}

export async function getPort() {
  return await WeshdModule.getPort();
}

export async function setValueAsync(value: string) {
  return await WeshdModule.setValueAsync(value);
}

export { WeshdView, WeshdViewProps, ChangeEventPayload };
