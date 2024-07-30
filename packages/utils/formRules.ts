import { bech32 } from "bech32";
import { ValidationRule } from "react-hook-form";

import { DEFAULT_FORM_ERRORS } from "@/utils/errors";
import { LETTERS_REGEXP, NUMBERS_REGEXP } from "@/utils/regex";

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

// export const patternOnlyEmail: ValidationRule<RegExp> = {
//   value: EMAIL_REGEXP,
//   message: DEFAULT_FORM_ERRORS.onlyEmail,
// };
//
// export const patternOnlyUrl: ValidationRule<RegExp> = {
//   value: URL_REGEX,
//   message: DEFAULT_FORM_ERRORS.onlyUrl,
// };

export const validateMaxNumber = (value: string, max: number) => {
  if (parseFloat(value) > max) {
    return "Max input value is " + max;
  }
  return true;
};

export const validateFloatWithDecimals = (value: string, decimals: number) => {
  const regexp = new RegExp(
    `^([0-9]+[.]?[0-9]{0,${decimals}}|[.][0-9]{1,${decimals}})$`,
  );
  return regexp.test(value);
};
