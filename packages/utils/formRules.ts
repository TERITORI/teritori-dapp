import { bech32 } from "bech32";
import { ValidationRule } from "react-hook-form";
import { ValidationValueMessage } from "react-hook-form/dist/types/validator";

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

export const patternOnlyNumbers: ValidationRule<RegExp> = {
  value: /^\d+$/,
  message: "Only numbers are allowed",
};

export const patternOnlyFloatNumbers: ValidationValueMessage<RegExp> = {
  value: /^[0-9]\d*(\.\d+)?$/,
  message: "Only numbers are allowed",
};
