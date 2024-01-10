import { Formik } from "formik";
import React from "react";
import { View } from "react-native";
import { number, object, string } from "yup";

import { MakeRequestFooter } from "./Footer";
import addSVG from "../../../../assets/icons/add.svg";
import { BrandText } from "../../../components/BrandText";
import { PrimaryButtonOutline } from "../../../components/buttons/PrimaryButtonOutline";
import { FileUploader } from "../../../components/fileUploader";
import { RoundedGradientImage } from "../../../components/images/RoundedGradientImage";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
import { IMAGE_MIME_TYPES } from "../../../utils/mime";
import { errorColor, neutral77, neutralA3 } from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14, fontSemibold20 } from "../../../utils/style/fonts";
import { useMakeRequestState } from "../hooks/useMakeRequestHook";
import { ShortDescData } from "../types";

const emptyValues: ShortDescData = {
  name: "",
  desc: "",
  budget: "",
  paymentAddr: "",
  coverImg: "",
  tags: "",
  funder: "",
  _coverImgFile: undefined,
};

const shortDescSchema = object({
  name: string().required().min(3),
  desc: string().required().min(10),
  funder: string().min(32),
  budget: number().required().positive().integer(),
  paymentAddr: string().required().min(6),
  coverImg: string().required().url(),
  tags: string().nullable(),
  _coverImgFile: object(),
});

export const ShortPresentation: React.FC = () => {
  const {
    actions: { goNextStep, setShortDesc },
    shortDescData,
  } = useMakeRequestState();

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
        validationSchema={shortDescSchema}
        onSubmit={(values) => {
          setShortDesc(values);
          goNextStep();
        }}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          setFieldValue,
          setFieldError,
        }) => {
          return (
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
                label="Expected funder"
                name="funder"
                fullWidth
                placeholder="Expected funder for the project"
                variant="labelOutside"
                onChangeText={handleChange("funder")}
                value={values.funder}
                error={errors.funder}
              />

              <SpacerColumn size={2.5} />

              <TextInputCustom
                label="Payment Address (Gnoland) *"
                name="paymentAddr"
                fullWidth
                placeholder="Type Gnoland payment address..."
                variant="labelOutside"
                onChangeText={handleChange("paymentAddr")}
                value={values.paymentAddr}
                defaultValue={"gopher20"}
                error={errors.paymentAddr}
              />
              <BrandText
                style={[
                  fontSemibold13,
                  { color: neutralA3, fontStyle: "italic" },
                ]}
              >
                * hardcoded to gopher20 for now !!!
              </BrandText>

              <SpacerColumn size={2.5} />

              <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
                Cover Image *
              </BrandText>

              <SpacerColumn size={1.5} />

              <FileUploader
                onUpload={async (files) => {
                  if (files[0].fileType !== "image") {
                    await setFieldError("coverImg", "file is not an image");
                  }
                  await setFieldValue("_coverImgFile", files[0]);
                }}
                mimeTypes={IMAGE_MIME_TYPES}
              >
                {({ onPress }) => (
                  <PrimaryButtonOutline
                    iconSVG={addSVG}
                    text="Select file"
                    fullWidth
                    size="M"
                    onPress={onPress}
                  />
                )}
              </FileUploader>

              <SpacerColumn size={1} />

              {errors.coverImg && (
                <BrandText style={[fontSemibold14, { color: errorColor }]}>
                  {errors.coverImg}
                </BrandText>
              )}

              <View style={{ alignItems: "center" }}>
                {values._coverImgFile?.url && (
                  <RoundedGradientImage
                    size="M"
                    square
                    sourceURI={values._coverImgFile?.url}
                  />
                )}
              </View>

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
                disableNext={
                  Object.keys(errors).length !== 0 || !values._coverImgFile
                }
                onSubmit={handleSubmit}
              />
            </>
          );
        }}
      </Formik>
    </View>
  );
};
