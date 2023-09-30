import { weshClient } from "../weshnet/client/client";

export const messageHandler = (message: { name: string; payload: any }) => {
  switch (message.name) {
    case "weshnet.port": {
      weshClient.port = message.payload;
      break;
    }
    default:
      console.log("unknown event received from Go:", message);
      break;
  }
};

export const handleAstilectronMessages = () => {
  try {
    document.addEventListener("astilectron-ready", function () {
      //@ts-ignore
      astilectron.onMessage(messageHandler);
    });
  } catch (err) {
    console.log("handle msg err", err);
  }
};
