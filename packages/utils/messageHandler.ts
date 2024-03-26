//@ts-nocheck
import { v4 } from "uuid";

const responses = {};

const handleMessage = (data) => {
  console.log(`message on web`, data);
  // eslint-disable-next-line no-restricted-syntax
  const parsedData: any = JSON.parse(data);

  if (parsedData.id) {
    responses[parsedData.id] = parsedData;
  }
};

const getAccounts = async () => {
  console.log("getAccounts called");
  const id = v4();

  window.ReactNativeWebView.postMessage(
    JSON.stringify({ type: "getAccounts", id }),
    "*",
  );
  while (!responses[id]) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("responses id found", responses[id]);

  if (responses[id].error) {
    throw new Error(responses[id].error);
  }

  return responses[id].data;
};

const execute = async (...params) => {
  const id = v4();

  window.ReactNativeWebView.postMessage(
    JSON.stringify({ type: "execute", id, data: params }),
    "*",
  );
  while (!responses[id]) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  if (responses[id].response) {
    return responses[id].data;
  }

  throw new Error(responses[id].error);
};

window.addEventListener("message", (nativeEvent) => {
  handleMessage(nativeEvent.data);
});
window.getAccounts = getAccounts;
window.CosmWasmClient = {
  execute,
};

console.log = function (...message) {
  window.ReactNativeWebView.postMessage(JSON.stringify({ log: true, message }));
};

console.error = function (...message) {
  window.ReactNativeWebView.postMessage(JSON.stringify({ log: true, message }));
};
