import { bech32 } from "bech32";
import { ValidationRule } from "react-hook-form";

import { LETTERS_REGEXP, NUMBERS_REGEXP } from "./regex";

import { DEFAULT_FORM_ERRORS } from "@/utils/errors";

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
  message: DEFAULT_FORM_ERRORS.onlyLetters,
};

export const patternOnlyNumbers: ValidationRule<RegExp> = {
  value: NUMBERS_REGEXP,
  message: DEFAULT_FORM_ERRORS.onlyNumbers,
};

export const validateMaxNumber = (value: string, max: number) => {
  if (parseFloat(value) > max) {
    return "Max input value is " + max;
  }
  return true;
};
