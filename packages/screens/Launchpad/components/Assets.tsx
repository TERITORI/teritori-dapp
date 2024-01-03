import React from "react";
import { useForm } from "react-hook-form";
import {
  SafeAreaView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import { SelectedFilesPreview } from "../../../components/FilePreview/SelectedFilesPreview";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SelectFileUploader } from "../../../components/selectFileUploader";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { IMAGE_MIME_TYPES } from "../../../utils/mime";
import { ARTICLE_THUMBNAIL_IMAGE_HEIGHT } from "../../../utils/social-feed";
import { neutral00, neutral33 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { NewCollectionFormValues } from "../CreateCollection.type";

export const Assets: React.FC = () => {
  const isMobile = useIsMobile();
  const { width: currentWidth } = useWindowDimensions();

  const { control } = useForm<NewCollectionFormValues>({
    defaultValues: {
      nftApiKey: "",
    },
    mode: "onBlur",
  });
  //TODO: Not handled for now
  // const { mutate: openGraphMutate, data: openGraphData } = useOpenGraph();
  const isLarge = currentWidth > 1400;
  return (
    <SafeAreaView
      style={{
        width: "100%",
        flex: 1,
      }}
    >
      <View
        style={[
          styles.container,
          {
            flexDirection: isLarge ? "row" : "column",
            // justifyContent: "center",
            // alignItems: "center",
          },
        ]}
      >
        {/* ===== Left container */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              maxWidth: 416,
              margin: layout.spacing_x2,
            }}
          >
            {/* <BrandText style={{ marginBottom: 12 }}>Left container</BrandText> */}
            <View
              style={{
                marginTop: isMobile ? layout.spacing_x2 : layout.contentSpacing,
              }}
            >
              <TextInputCustom<NewCollectionFormValues>
                rules={{ required: true }}
                label="NFT.Storage API Key"
                placeHolder="My Awesome Collection"
                name="nftApiKey"
                control={control}
                variant="labelOutside"
                containerStyle={{ marginBottom: layout.spacing_x3 }}
                boxMainContainerStyle={{
                  backgroundColor: neutral00,
                  borderRadius: 12,
                }}
              />
              <SelectFileUploader
                label="Asset selection"
                fileHeight={ARTICLE_THUMBNAIL_IMAGE_HEIGHT}
                isImageCover
                style={{
                  marginVertical: layout.spacing_x3,
                  width: 416,
                  maxHeight: 100,
                }}
                onUpload={(files) => {}}
                mimeTypes={IMAGE_MIME_TYPES}
              />
              <SelectFileUploader
                label="Metadata selection"
                fileHeight={ARTICLE_THUMBNAIL_IMAGE_HEIGHT}
                isImageCover
                style={{
                  marginVertical: layout.spacing_x3,
                  width: 416,
                  maxHeight: 100,
                }}
                onUpload={(files) => {}}
                mimeTypes={IMAGE_MIME_TYPES}
              />
            </View>
          </View>
        </View>
        {isLarge && (
          <View
            style={{
              width: 1,
              backgroundColor: neutral33,
              margin: layout.spacing_x2,
            }}
          />
        )}

        {/* ===== Right container */}
        <View
          style={{
            justifyContent: "flex-start",
            width: "100%",
            flex: 1,
            margin: layout.spacing_x2,
          }}
        >
          <SelectedFilesPreview></SelectedFilesPreview>
        </View>
      </View>
    </SafeAreaView>
  );
};

// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    flexDirection: "row",
    zIndex: 999,
    borderBottomWidth: 1,
    borderColor: neutral33,
  },
});
