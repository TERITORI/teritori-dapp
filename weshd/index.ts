import WeshdModule from "./src/WeshdModule";

export function boot(): number {
  return WeshdModule.boot();
}

export async function getPort() {
  return await WeshdModule.getPort();
}

export async function shutdown() {
  return await WeshdModule.shutdown();
}

export async function setValueAsync(value: string) {
  return await WeshdModule.setValueAsync(value);
}
