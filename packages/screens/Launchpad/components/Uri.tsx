import React from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView, StyleSheet, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { neutral00, neutral33, neutral77 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import {
  NewCollectionDetailsFormValues,
  NewCollectionFormForEistingBaseUrlValues,
} from "../CreateCollection.type";

export const Uri: React.FC = () => {
  const { control } = useForm<
    NewCollectionFormForEistingBaseUrlValues | NewCollectionDetailsFormValues
  >({
    defaultValues: {
      baseTokenUri: "",
      coverImageUrl: "",
      name: "",
      description: "",
      symbol: "",
      externalLink: "",
      websiteLink: "",
      twitterProfileUrl: "",
      twitterFollowers: "",
      discordName: "",
      email: "",
    },
    mode: "onBlur",
  });
  const isMobile = useIsMobile();

  return (
    <SafeAreaView style={{ width: "100%", flex: 1 }}>
      <View style={styles.container}>
        <View
          style={{
            width: "100%",
            maxWidth: 416,
            margin: layout.spacing_x2,
          }}
        >
          <BrandText
            style={[fontSemibold14, { color: neutral77, textAlign: "center" }]}
          >
            Though Teritori's tr721 contract allows for off-chain metadata
            storage, it is recommended to use a decentralized storage solution,
            such as IPFS. You may head over to NFT.Storage and upload your
            assets & metadata manually to get a base URI for your collection.
          </BrandText>

          <View
            style={{
              marginTop: isMobile ? layout.spacing_x2 : layout.contentSpacing,
            }}
          >
            <TextInputCustom<
              | NewCollectionFormForEistingBaseUrlValues
              | NewCollectionDetailsFormValues
            >
              rules={{ required: true }}
              label="Base Token URI"
              placeHolder="ipfs://"
              name="baseTokenUri"
              control={control}
              variant="labelOutside"
              containerStyle={{ marginBottom: layout.spacing_x3 }}
              boxMainContainerStyle={{
                backgroundColor: neutral00,
                borderRadius: 12,
              }}
            />
            <TextInputCustom<
              | NewCollectionFormForEistingBaseUrlValues
              | NewCollectionDetailsFormValues
            >
              rules={{ required: true }}
              label="Cover Image URL"
              placeHolder="ipfs://"
              name="coverImageUrl"
              control={control}
              variant="labelOutside"
              containerStyle={{ marginBottom: layout.spacing_x3 }}
              boxMainContainerStyle={{
                backgroundColor: neutral00,
                borderRadius: 12,
              }}
            />
          </View>
          <View style={{ borderBottomWidth: 1, borderColor: neutral33 }} />
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
    justifyContent: "center",
    zIndex: 999,
  },
});
