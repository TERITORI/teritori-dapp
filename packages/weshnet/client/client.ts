import { createWeshClient } from "../index";
const params = new URL(window.location.href);
console.log(window.location.href);
const weshPort = params.searchParams.get("weshPort") || 4242;
console.log("weshPort", weshPort);

export const weshClient = createWeshClient(`http://localhost:${weshPort}`);
