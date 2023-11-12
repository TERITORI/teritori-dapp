export const DEFAULT_FORM_ERRORS = {
  required: "This field is required",
};

export const DETAULT_PROCESS_ERROR =
  "Something went wrong, Please try again after sometime!";

export const errorMessage = (e: unknown) => {
  if (e instanceof Error) {
    return e.message;
  } else {
    return `${e}`;
  }
};
