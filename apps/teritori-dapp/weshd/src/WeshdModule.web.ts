export default {
  boot() {},
  getPort() {
    const params = new URL(window?.location?.href || "");
    return Number(params?.searchParams?.get("weshPort") || 0);
  },
  shutdown() {},
};
