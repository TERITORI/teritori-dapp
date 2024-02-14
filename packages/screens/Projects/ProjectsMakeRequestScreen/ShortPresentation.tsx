import { Formik } from "formik";
import React, { useState } from "react";
import { View } from "react-native";
import { object, string } from "yup";

import { MakeRequestFooter } from "./Footer";
import addSVG from "../../../../assets/icons/add.svg";
import { BrandText } from "../../../components/BrandText";
import { PrimaryButtonOutline } from "../../../components/buttons/PrimaryButtonOutline";
import { FileUploader } from "../../../components/fileUploader";
import { RoundedGradientImage } from "../../../components/images/RoundedGradientImage";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
import { useNameSearch } from "../../../hooks/search/useNameSearch";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { IMAGE_MIME_TYPES } from "../../../utils/mime";
import { errorColor, neutral77, neutralA3 } from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { TNSResult } from "../components/TNSResult";
import { emptyShortDesc } from "../defaultValues";
import { useMakeRequestState } from "../hooks/useMakeRequestHook";

import { ButtonsGroup } from "@/screens/Projects/components/ButtonsGroup";

const shortDescSchema = object({
  name: string().required().min(3),
  desc: string().required().min(10),
  funder: string(),
  contractor: string().min(32),
  coverImg: string().required(),
  arbitrator: string().required(),
  tags: string().nullable(),
  _coverImgFile: object(),
});

const CREATOR_TYPE_CONTRACTOR = "contractor";
const CREATOR_TYPE_FUNDER = "funder";

export const ShortPresentation: React.FC = () => {
  const {
    actions: { goNextStep, setShortDesc },
    shortDescData,
  } = useMakeRequestState();
  const selectedWallet = useSelectedWallet();
  const caller = selectedWallet?.address;
  const selectedNetworkId = useSelectedNetworkId();
  const [searchTNSText, setSearchTNSText] = useState("");
  const [isTNSVisible, setIsTNSVisible] = useState(false);

  const [creatorType, setCreatorType] = useState(CREATOR_TYPE_CONTRACTOR);

  const { names } = useNameSearch({
    networkId: selectedNetworkId,
    input: searchTNSText,
    limit: 12,
  });

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
          if (creatorType === CREATOR_TYPE_CONTRACTOR) {
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
                  I'm *
                </BrandText>

                <SpacerColumn size={1} />

                <ButtonsGroup
                  size="XS"
                  texts={[
                    "A contractor looking for a funder",
                    "A funder looking for a developer",
                  ]}
                  selectedId={creatorType === CREATOR_TYPE_CONTRACTOR ? 0 : 1}
                  onChange={async (selectedId) => {
                    if (selectedId === 0) {
                      setCreatorType(CREATOR_TYPE_CONTRACTOR);
                      await setFieldValue("contractor", caller);
                      await setFieldValue("funder", "");
                    } else {
                      setCreatorType(CREATOR_TYPE_FUNDER);
                      await setFieldValue("funder", caller);
                      await setFieldValue("contractor", "");
                    }
                  }}
                />
              </View>

              <SpacerColumn size={2.5} />

              <View style={{ position: "relative", zIndex: 2 }}>
                <TextInputCustom
                  label={
                    creatorType === CREATOR_TYPE_FUNDER
                      ? "Potential developer"
                      : "Potential funder"
                  }
                  name="funder"
                  fullWidth
                  placeholder="Type the potential user address here..."
                  variant="labelOutside"
                  onChangeText={(text) => {
                    setSearchTNSText(text);
                    setIsTNSVisible(true);
                    return handleChange(
                      creatorType === CREATOR_TYPE_FUNDER
                        ? CREATOR_TYPE_CONTRACTOR
                        : CREATOR_TYPE_FUNDER,
                    )(text);
                  }}
                  value={
                    creatorType === CREATOR_TYPE_FUNDER
                      ? values.contractor
                      : values.funder
                  }
                  error={
                    creatorType === CREATOR_TYPE_FUNDER
                      ? errors.contractor
                      : errors.funder
                  }
                />

                <TNSResult
                  visible={isTNSVisible && names.length > 0}
                  networkId={selectedNetworkId}
                  names={names}
                  onSelected={(name) => {
                    setIsTNSVisible(false);
                    return handleChange(
                      creatorType === CREATOR_TYPE_FUNDER
                        ? CREATOR_TYPE_CONTRACTOR
                        : CREATOR_TYPE_FUNDER,
                    )(name);
                  }}
                />
              </View>

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
                label="Arbitrator address"
                name="arbitrator"
                fullWidth
                placeholder="Address of the authority that will resolve conflicts"
                variant="labelOutside"
                onChangeText={handleChange("arbitrator")}
                value={values.arbitrator}
                error={errors.arbitrator}
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
                    return;
                  }
                  await setFieldValue("coverImg", files[0].url);
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
