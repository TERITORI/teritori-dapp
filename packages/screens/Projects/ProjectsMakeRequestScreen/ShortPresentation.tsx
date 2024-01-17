import { Formik } from "formik";
import React, { useState } from "react";
import { View } from "react-native";
import { RadioButton } from "react-native-paper";
import { object, string } from "yup";

import { MakeRequestFooter } from "./Footer";
import addSVG from "../../../../assets/icons/add.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { PrimaryButtonOutline } from "../../../components/buttons/PrimaryButtonOutline";
import { FileUploader } from "../../../components/fileUploader";
import { RoundedGradientImage } from "../../../components/images/RoundedGradientImage";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { IMAGE_MIME_TYPES } from "../../../utils/mime";
import {
  errorColor,
  neutral77,
  neutralA3,
  primaryColor,
} from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { emptyShortDesc } from "../defaultValues";
import { useMakeRequestState } from "../hooks/useMakeRequestHook";

const shortDescSchema = object({
  name: string().required().min(3),
  desc: string().required().min(10),
  funder: string().min(32),
  contractor: string().min(32),
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
  const selectedWallet = useSelectedWallet();
  const caller = selectedWallet?.address;

  const [creatorType, setCreatorType] = useState("contractor");

  if (!caller) {
    return null;
  }

  return (
    <View style={{ width: "100%", maxWidth: 480, margin: "auto" }}>
      <BrandText style={fontSemibold20}>Grant details</BrandText>

      <SpacerColumn size={1} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Information about your Grant
      </BrandText>

      <SpacerColumn size={2.5} />

      <Formik
        initialValues={shortDescData || emptyShortDesc}
        validationSchema={shortDescSchema}
        onSubmit={(values) => {
          if (creatorType === "contractor") {
            values.contractor = caller;
          } else {
            values.funder = caller;
          }

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
              <View>
                <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
                  Creator type
                </BrandText>

                <FlexRow>
                  <RadioButton
                    value="contractor"
                    color={primaryColor}
                    uncheckedColor="#777777"
                    status={
                      creatorType === "contractor" ? "checked" : "unchecked"
                    }
                    onPress={async () => {
                      setCreatorType("contractor");
                      await setFieldValue("contractor", caller);
                      await setFieldValue("funder", "");
                    }}
                  />
                  <BrandText
                    onPress={async () => {
                      setCreatorType("contractor");
                      await setFieldValue("contractor", caller);
                      await setFieldValue("funder", "");
                    }}
                    style={fontSemibold14}
                  >
                    I'm contractor who looks for a funder
                  </BrandText>
                </FlexRow>

                <FlexRow>
                  <RadioButton
                    value="funder"
                    color={primaryColor}
                    uncheckedColor="#777777"
                    status={creatorType === "funder" ? "checked" : "unchecked"}
                    onPress={async () => {
                      setCreatorType("funder");
                      await setFieldValue("funder", caller);
                      await setFieldValue("contractor", "");
                    }}
                  />
                  <BrandText
                    onPress={async () => {
                      setCreatorType("funder");
                      await setFieldValue("funder", caller);
                      await setFieldValue("contractor", "");
                    }}
                    style={fontSemibold14}
                  >
                    I'm funder who looks for a developer
                  </BrandText>
                </FlexRow>
              </View>

              <SpacerColumn size={2.5} />

              <TextInputCustom
                label={
                  creatorType === "funder"
                    ? "Potential contractor"
                    : "Potential funder"
                }
                name="funder"
                fullWidth
                placeholder="Type the potential user address here..."
                variant="labelOutside"
                onChangeText={handleChange(
                  creatorType === "funder" ? "contractor" : "funder",
                )}
                value={
                  creatorType === "funder" ? values.contractor : values.funder
                }
                error={
                  creatorType === "funder" ? errors.contractor : errors.funder
                }
              />

              <SpacerColumn size={2.5} />

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
                label="Payment Address (Gnoland) *"
                name="paymentAddr"
                fullWidth
                placeholder="Type Gnoland payment address..."
                variant="labelOutside"
                onChangeText={handleChange("paymentAddr")}
                value={values.paymentAddr}
                defaultValue="gno.land/r/demo/tori20"
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
