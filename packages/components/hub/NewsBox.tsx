import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, ScrollView, useWindowDimensions, View } from "react-native";

import { BrandText } from "../BrandText";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { SecondaryButtonOutline } from "../buttons/SecondaryButtonOutline";
import { GradientText } from "../gradientText";

import { News } from "@/api/marketplace/v1/marketplace";
import editSVG from "@/assets/icons/input-edit.svg";
import { Link } from "@/components/Link";
import { SVG } from "@/components/SVG";
import { SecondaryBox } from "@/components/boxes/SecondaryBox";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { FileUploader } from "@/components/inputs/fileUploader";
import { web3ToWeb2URI } from "@/utils/ipfs";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import { borderRadiusButton, heightButton } from "@/utils/style/buttons";
import {
  neutral00,
  neutral33,
  neutral77,
  primaryColor,
  primaryTextColor,
  secondaryColor,
} from "@/utils/style/colors";
import {
  fontSemibold14,
  fontSemibold20,
  fontSemibold28,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { NewsForm, ZodNewsForm } from "@/utils/types/news";

const breakPoint = 768;
const height = 342;
const textMaxHeight = 170;
export const actionUrlInputContainerHeight = 48;

//TODO: "Add a News" + "Remove this News"

export const NewsBox: React.FC<{
  news: News;
  isEditing?: boolean;
  setHasInvalidNews?: Dispatch<SetStateAction<boolean>>;
  setHasChanges?: Dispatch<SetStateAction<boolean>>;
}> = ({ news, isEditing, setHasInvalidNews, setHasChanges }) => {
  const { width } = useWindowDimensions();
  const [paragraphTextAreaHeight, setParagraphTextAreaHeight] = useState(40);

  const newsForm = useForm<NewsForm>({
    mode: "all",
    defaultValues: {
      title: news.title,
      subtitle: news.subtitle,
      text: news.text,
      image: news.image,
      action1: news.actions[0],
      action2: news.actions[1],
    },
    resolver: zodResolver(ZodNewsForm),
  });

  const image = newsForm.watch("image");
  const text = newsForm.watch("text");
  // const title = newsForm.watch("title")
  // const subtitle = newsForm.watch("subtitle")
  // const action1Label = newsForm.watch("action1.label")
  // const action1Url = newsForm.watch("action1.url")
  // const action2Label = newsForm.watch("action2.label")
  // const action2Url = newsForm.watch("action2.url")

  useEffect(() => {
    if (!text) setParagraphTextAreaHeight(40);
  }, [text]);

  // useEffect(() => {
  //   if(action1.url && !action1.label) {
  //     newsForm.setError("action1.label", {message: "Missing label"})
  //   }
  //   if(!action1.url && action1.label) {
  //     newsForm.setError("action1.url", {message: "Missing URL or page"})
  //   }
  //   if(action2.url && !action2.label) {
  //     newsForm.setError("action2.label", {message: "Missing label"})
  //   }
  //   if(!action2.url && action2.label) {
  //     newsForm.setError("action2.url", {message: "Missing URL or page"})
  //   }
  // }, [action1.url, action1.label, action2.url, action2.label])

  // useEffect(() => {
  //   if(!setHasInvalidNews) return
  //   setHasInvalidNews(
  //       !newsForm.formState.isValid ||
  //       (!!action1Url && !action1Label) || (!action1Url && !!action1Label) ||
  //       (!!action2Url && !action2Label) || (!action2Url && !!action2Label)
  //     )
  // }, [newsForm.formState.isValid, action1Url, action1Label, action2Url, action2Label])

  // useEffect(() => {
  //   if(!setHasChanges) return
  //   setHasChanges(
  //     action1Url !== news.actions[0]?.url ||
  //     action2Url !== news.actions[1]?.url ||
  //     action1Label !== news.actions[0]?.label ||
  //     action2Label !== news.actions[1]?.label ||
  //     title !== news.title ||
  //     subtitle !== news.subtitle ||
  //     text !== news.text ||
  //     image !== news.image
  //   )
  // }, [
  //   action1Url, action1Label, action2Url, action2Label,
  //   news.actions[0]?.url, news.actions[1]?.url, news.actions[0]?.label, news.actions[1]?.label,
  //   title, subtitle, text, image,
  //   news.title, news.subtitle, news.text, news.image,
  // ])

  return (
    <View
      style={{
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: neutral33,
        paddingHorizontal: layout.spacing_x1_25,
        paddingVertical: layout.spacing_x2_5,
        height: isEditing
          ? height + layout.spacing_x2_5 * 2 + actionUrlInputContainerHeight
          : height + layout.spacing_x2_5 * 2,
      }}
    >
      <View
        style={[
          { width: "100%", height: "100%" },
          width > breakPoint
            ? {
                flexDirection: "row",
                justifyContent: "space-between",
              }
            : { flexDirection: "column-reverse" },
        ]}
      >
        {/*==== Left container*/}
        <View
          style={[
            width > breakPoint ? { flex: 1 } : { width: "100%" },
            { justifyContent: "space-between", marginTop: 12 },
          ]}
        >
          <View>
            {/* ---- In edition, title, subtitle and text are inputs */}
            {isEditing ? (
              <TextInputCustom
                placeHolder="EDIT TITLE"
                label=""
                name="title"
                variant="noStyle"
                control={newsForm.control}
                textInputStyle={[fontSemibold28, { color: primaryColor }]}
                valueModifier={(value) => value.toUpperCase()}
              />
            ) : (
              <GradientText gradientType="blueExtended" style={fontSemibold28}>
                {news.title}
              </GradientText>
            )}

            {isEditing ? (
              <TextInputCustom
                control={newsForm.control}
                placeHolder="Edit subtitle"
                label=""
                name="subtitle"
                variant="noStyle"
                textInputStyle={[fontSemibold20]}
              />
            ) : (
              <BrandText style={fontSemibold20}>{news.subtitle}</BrandText>
            )}
          </View>

          {isEditing ? (
            <TextInputCustom
              label=""
              control={newsForm.control}
              placeHolder="Edit paragraph"
              multiline
              onContentSizeChange={(e) =>
                setParagraphTextAreaHeight(e.nativeEvent.contentSize.height)
              }
              name="text"
              variant="noStyle"
              textInputStyle={[
                fontSemibold14,
                {
                  color: neutral77,
                  height: paragraphTextAreaHeight,
                  maxHeight: textMaxHeight,
                  marginTop: layout.spacing_x2_5,
                  marginBottom: layout.spacing_x4,
                },
              ]}
            />
          ) : (
            <ScrollView
              style={{
                maxHeight: textMaxHeight,
                marginTop: layout.spacing_x2_5,
                marginBottom: layout.spacing_x4,
              }}
              contentContainerStyle={{ height: "100%" }}
            >
              <BrandText
                style={[
                  fontSemibold14,
                  { color: neutral77, height: "100%", alignContent: "center" },
                ]}
              >
                {news.text}
              </BrandText>
            </ScrollView>
          )}

          <View
            style={{
              flexDirection: "row",
              marginBottom: layout.spacing_x1_5,
            }}
          >
            {/* ---- In edition, we show buttons-like with an input in them.
             We show also an input under each button, to specify the action's URL
             */}
            {isEditing ? (
              <>
                {/*Action 1 (edition)*/}
                <View style={{ marginRight: layout.spacing_x2 }}>
                  <SecondaryBox
                    style={{
                      borderRadius: borderRadiusButton("SM"),
                      backgroundColor: secondaryColor,
                      borderWidth: 1,
                      height: heightButton("SM"),
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TextInputCustom
                      label=""
                      control={newsForm.control}
                      placeHolder="Edit action 1 label"
                      name="action1.label"
                      variant="noStyle"
                      textInputStyle={[
                        fontSemibold14,
                        {
                          color: neutral00,
                          paddingHorizontal: layout.spacing_x2_5,
                        },
                      ]}
                    />
                  </SecondaryBox>

                  <View
                    style={{
                      height: actionUrlInputContainerHeight,
                      justifyContent: "flex-end",
                    }}
                  >
                    <TextInputCustom
                      label=""
                      name="action1.url"
                      noBrokenCorners
                      variant="regular"
                      placeHolder="Edit action 1 URL or page"
                      control={newsForm.control}
                      height={40}
                    />
                  </View>
                </View>

                {/*Action 2 (edition)*/}
                <View>
                  <TertiaryBox
                    style={{
                      height: heightButton("SM"),
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: borderRadiusButton("SM"),
                      backgroundColor: neutral00,
                      paddingHorizontal: layout.spacing_x2_5,
                      borderColor: secondaryColor,
                    }}
                  >
                    <TextInputCustom
                      label=""
                      control={newsForm.control}
                      placeHolder="Edit action 2 label"
                      name="action2.label"
                      variant="noStyle"
                      textInputStyle={[
                        fontSemibold14,
                        { color: secondaryColor },
                      ]}
                    />
                  </TertiaryBox>

                  <View
                    style={{
                      height: actionUrlInputContainerHeight,
                      justifyContent: "flex-end",
                    }}
                  >
                    <TextInputCustom
                      label=""
                      name="action2.url"
                      noBrokenCorners
                      variant="regular"
                      placeHolder="Edit action 2 URL or page"
                      control={newsForm.control}
                      height={40}
                    />
                  </View>
                </View>
              </>
            ) : news.actions.length > 0 ? (
              // Action 1
              <Link to={news.actions[0].url}>
                <SecondaryButton
                  style={{ marginRight: layout.spacing_x2 }}
                  backgroundColor={secondaryColor}
                  color={neutral00}
                  size="SM"
                  text={news.actions[0].label}
                />
              </Link>
            ) : // Action 2
            news.actions.length > 1 ? (
              <Link to={news.actions[1].url}>
                <SecondaryButtonOutline
                  backgroundColor="#000000"
                  size="SM"
                  text={news.actions[1].label}
                />
              </Link>
            ) : null}
          </View>
        </View>

        {/*==== Right container (image)*/}
        <View
          style={
            width > breakPoint
              ? { marginLeft: 44 }
              : { marginBottom: 44, width: "100%", alignItems: "center" }
          }
        >
          <Image
            source={{
              uri: isEditing ? web3ToWeb2URI(image) : web3ToWeb2URI(news.image),
            }}
            style={{
              height,
              width: height,
              aspectRatio: 1,
              borderRadius: 10,
            }}
          />

          {isEditing && (
            <Controller<NewsForm>
              control={newsForm.control}
              name="image"
              render={({ field: { onChange } }) => (
                <FileUploader
                  onUpload={(files) => {
                    onChange(files[0].url);
                  }}
                  mimeTypes={IMAGE_MIME_TYPES}
                >
                  {({ onPress }) => (
                    <CustomPressable
                      style={{
                        borderRadius: 999,
                        backgroundColor: primaryColor,
                        width: 32,
                        height: 32,
                        position: "absolute",
                        left: 16,
                        top: 16,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={onPress}
                    >
                      <SVG
                        width={16}
                        height={16}
                        source={editSVG}
                        color={primaryTextColor}
                      />
                    </CustomPressable>
                  )}
                </FileUploader>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
};
