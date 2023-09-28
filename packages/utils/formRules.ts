import { bech32 } from "bech32";
import { ValidationRule } from "react-hook-form";

import { TeritoriNameServiceQueryClient } from "../contracts-clients/teritori-name-service/TeritoriNameService.client";
import {
  mustGetCosmosNetwork,
  mustGetNonSigningCosmWasmClient,
} from "../networks";

// validator should return false or string to trigger error
export const validateAddress = (value: string) => {
  try {
    bech32.decode(value);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return "The address is invalid";
  }
};
export const validateNS = (value: string) => {
  if (value.length > 5 && value.substring(value.length - 5) === ".tori") {
    return true;
  } else {
    return "Invalid NS";
  }
};

export const getNSAddress = async (value: string, networkId: string) => {
  const resValidate = validateNS(value);
  if (resValidate !== true) {
    return { status: false, msg: resValidate };
  }
  const network = mustGetCosmosNetwork(networkId);
  if (!network.nameServiceContractAddress) {
    return { status: false, msg: "Can not get TNS" };
  }
  const client = await mustGetNonSigningCosmWasmClient(networkId);
  const tnsClient = new TeritoriNameServiceQueryClient(
    client,
    network.nameServiceContractAddress
  );
  try {
    const res = await tnsClient.addressOf({ tokenId: value });
    return { address: res.owner, status: true };
  } catch (err) {
    console.log(err);
    return { status: false, msg: "Invalid TNS" };
  }
};
export const patternOnlyLetters: ValidationRule<RegExp> = {
  value: /^[A-Za-z]+$/,
  message: "Only letters are allowed",
};

export const patternOnlyNumbers: ValidationRule<RegExp> = {
  value: /^\d+$/,
  message: "Only numbers are allowed",
};

export const validateMaxNumber = (value: string, max: number) => {
  if (parseFloat(value) > max) {
    return "Max input value is " + max;
  }
  return true;
};
