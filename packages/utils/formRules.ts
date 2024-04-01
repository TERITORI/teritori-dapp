import { bech32 } from "bech32";
import { ValidationRule } from "react-hook-form";

import { EMAIL_REGEXP, LETTERS_REGEXP, NUMBERS_REGEXP } from "@/utils/regex";

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

export const patternOnlyLetters: ValidationRule<RegExp> = {
  value: LETTERS_REGEXP,
  message: "Only letters are allowed",
};

export const patternOnlyNumbers: ValidationRule<RegExp> = {
  value: NUMBERS_REGEXP,
  message: "Only numbers are allowed",
};

export const patternOnlyEmail: ValidationRule<RegExp> = {
  value: EMAIL_REGEXP,
  message: "Only email address is allowed",
};

export const validateMaxNumber = (value: string, max: number) => {
  if (parseFloat(value) > max) {
    return "Max input value is " + max;
  }
  return true;
};
