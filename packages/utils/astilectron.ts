import { weshClient } from "../weshnet/client/client";

export const messageHandler = (message: { name: string; payload: any }) => {
  console.log("electronmessage", message);
  try {
    switch (message.name) {
      case "weshnet.port": {
        console.log("weshnet port received", message);

        weshClient.createClient(message.payload);

        break;
      }
      default:
        console.log("unknown event received from Go:", message);
        break;
    }
  } catch (err) {}
};

export const handleAstilectronMessages = () => {
  try {
    document.addEventListener("astilectron-ready", function () {
      astilectron.onMessage(messageHandler);
    });
  } catch (err) {
    console.log("handle msg err", err?.message);
  }
};
