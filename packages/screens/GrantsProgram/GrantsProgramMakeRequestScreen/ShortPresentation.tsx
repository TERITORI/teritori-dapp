import { Formik } from "formik";
import React from "react";
import { View } from "react-native";

import { MakeRequestFooter } from "./Footer";
import { ShortDescData } from "./types";
import { useMakeRequestState } from "./useMakeRequestHook";
import { BrandText } from "../../../components/BrandText";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../../utils/style/fonts";

const emptyValues: ShortDescData = {
  name: "",
  desc: "",
  budget: "",
  paymentAddr: "",
  coverImg: "",
  tags: "",
};

export const ShortPresentation: React.FC = () => {
  const {
    actions: { goNextStep, setShortDesc },
    shortDescData,
  } = useMakeRequestState();

  const validate = (values: ShortDescData) => {
    const errors: any = {};
    if (!values.name || values.name.length < 3) {
      errors.name = "Name is required and must have atleast 3 chars.";
    } else if (!values.desc || values.desc.length < 20) {
      errors.desc = "Description is required and must have atleast 20 chars.";
    }
    return errors;
  };

  return (
    <View style={{ width: "100%", maxWidth: 480, margin: "auto" }}>
      <BrandText style={fontSemibold20}>Grant details</BrandText>

      <SpacerColumn size={1} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Information about your Grant
      </BrandText>

      <SpacerColumn size={2.5} />

      <Formik
        initialValues={shortDescData || emptyValues}
        validate={validate}
        onSubmit={(values) => {
          setShortDesc(values);
          goNextStep();
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <>
            <TextInputCustom
              label="Name *"
              name="name"
              fullWidth
              placeholder="Your Grant name"
              variant="labelOutside"
              onChangeText={handleChange("name")}
              value={values.name}
              error={errors.name}
            />

            <SpacerColumn size={2.5} />

            <TextInputCustom
              label="Description *"
              name="description"
              fullWidth
              multiline
              placeholder="Your Grant description"
              textInputStyle={{ height: 80 }}
              variant="labelOutside"
              onChangeText={handleChange("desc")}
              value={values.desc}
              error={errors.desc}
            />

            <SpacerColumn size={2.5} />

            <TextInputCustom
              label="Budget *"
              name="budget"
              fullWidth
              placeholder="What budget do you need?"
              variant="labelOutside"
              onChangeText={handleChange("budget")}
              value={values.budget}
              error={errors.budget}
            />

            <SpacerColumn size={2.5} />

            <TextInputCustom
              label="Payment Address (Gnoland or Cosmos) *"
              name="paymentAddr"
              fullWidth
              placeholder="Type Gnoland or Cosmos payment address..."
              variant="labelOutside"
              onChangeText={handleChange("paymentAddr")}
              value={values.paymentAddr}
              error={errors.paymentAddr}
            />

            <SpacerColumn size={2.5} />

            <TextInputCustom
              label="Cover image *"
              name="coverImg"
              fullWidth
              placeholder="Type Gnoland or Cosmos payment address..."
              variant="labelOutside"
              onChangeText={handleChange("coverImg")}
              value={values.coverImg}
              error={errors.coverImg}
            />

            <SpacerColumn size={2.5} />

            <TextInputCustom
              label="Tags *"
              name="tags"
              fullWidth
              placeholder="Add  1-5 main Grant tags using comma..."
              variant="labelOutside"
              onChangeText={handleChange("tags")}
              value={values.tags}
              error={errors.tags}
            />

            <MakeRequestFooter
              disableNext={Object.keys(errors).length !== 0}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </Formik>
    </View>
  );
};
