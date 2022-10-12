import moment from "moment";
import * as yup from "yup";

export const validationSchema = yup.object().shape({
  sellMethod: yup.string().required(),
  setPrice: yup
    .number()
    .required("Price is required")
    .typeError("Price is required"),
  setPriceToken: yup.string().required(),
  royaltyFee: yup
    .number()
    .required("Royalty fee is required")
    .typeError("Royalty fee is required"),
  platformFee: yup
    .number()
    .required("Platform fee is required")
    .typeError("Platform fee is required"),
  listingType: yup.string().required(),
  expirationDateTime: yup
    .string()
    .required("Expiration date is required")
    .test("valid-date-time", function (value) {
      if (
        !value ||
        value?.length < 16 ||
        !moment(value, "YYYY/MM/DD hh:mm").isValid()
      ) {
        return this.createError({
          path: this.path,
          message: "Please check date time format",
        });
      }
      return true;
    }),
  minimumMarkup: yup.number().required(),
  minimumBid: yup.number().when("sellMethod", {
    is: "highest-bid",
    then: yup
      .number()
      .required("Minimum bid is required")
      .typeError("Minimum bid is required"),
  }),
  listingDateTime: yup.string().when("listingType", {
    is: "custom-list-time",
    then: yup
      .string()
      .required("Listing date is required")
      .test("valid-date-time", function (value) {
        if (
          !value ||
          value?.length < 16 ||
          !moment(value, "YYYY/MM/DD hh:mm").isValid()
        ) {
          return this.createError({
            path: this.path,
            message: "Please check date format",
          });
        }
        return true;
      }),
  }),
});
