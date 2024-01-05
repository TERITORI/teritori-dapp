import React from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
import { neutral00, neutral77 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { NewCollectionFormForEistingBaseUrlValues } from "../CreateCollection.type";

export const UriTab: React.FC = () => {
  const { control } = useForm<NewCollectionFormForEistingBaseUrlValues>({
    defaultValues: {
      baseTokenUri: "",
      coverImageUrl: "",
    },
    mode: "onBlur",
  });

  return (
    <SafeAreaView style={{ width: "100%", flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
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

          <SpacerColumn size={2} />

          <View>
            <TextInputCustom<NewCollectionFormForEistingBaseUrlValues>
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
            <TextInputCustom<NewCollectionFormForEistingBaseUrlValues>
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
        </View>
      </View>
    </SafeAreaView>
  );
};
