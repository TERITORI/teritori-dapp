import { EventEmitter } from "expo-modules-core";

const emitter = new EventEmitter({} as any);

export default {
  PI: Math.PI,
  async setValueAsync(value: string): Promise<void> {
    emitter.emit("onChange", { value });
  },
  boot() {},
  getPort() {
    const params = new URL(window?.location?.href || "");
    return Number(params?.searchParams?.get("weshPort") || 0);
  },
};
