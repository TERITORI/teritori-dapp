import React from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { TextInputLaunchpadUrlValues } from "./inputs/TextInputLaunchpadUrlValues";
import { BrandText } from "../../../components/BrandText";
import { SpacerColumn } from "../../../components/spacer";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { ExistingBaseUrlFormValues } from "../CreateCollection.type";

export const UriTab: React.FC = () => {
  const { control } = useForm<ExistingBaseUrlFormValues>({
    defaultValues: {
      baseTokenUri: "",
      coverImageUrl: "",
    },
    mode: "onBlur",
  });

  return (
    <View style={{ width: "100%", flex: 1 }}>
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
            <TextInputLaunchpadUrlValues
              label="Base Token URI"
              placeHolder="ipfs://"
              name="baseTokenUri"
              control={control}
            />

            <TextInputLaunchpadUrlValues
              name="coverImageUrl"
              label="Cover Image URL"
              placeHolder="ipfs://"
              control={control}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
