import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { launchpadCreateFormMaxWidth } from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/LaunchpadCreateScreen";
import { TextInputLaunchpad } from "@/screens/Launchpad/LaunchpadApply/components/inputs/TextInputLaunchpad";
import { neutral77 } from "@/utils/style/colors";
import { fontMedium14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { CollectionFormValues } from "@/utils/types/launchpad";

interface Props {
  collectionForm: UseFormReturn<CollectionFormValues>;
}
export const UriTab: FC<Props> = ({ collectionForm }) => {
  return (
    <View style={{ width: "100%", marginTop: layout.spacing_x2 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: launchpadCreateFormMaxWidth,
            margin: layout.spacing_x2,
          }}
        >
          <BrandText
            style={[fontMedium14, { color: neutral77, textAlign: "center" }]}
          >
            Though Teritori's tr721 contract allows for off-chain metadata
            storage, it is recommended to use a decentralized storage solution,
            such as IPFS. You may head over to NFT.Storage and upload your
            assets & metadata manually to get a base URI for your collection.
          </BrandText>
          <SpacerColumn size={2} />

          <TextInputLaunchpad<CollectionFormValues>
            label="Base Token URI"
            placeHolder="ipfs://"
            name="baseTokenUri"
            form={collectionForm}
            required={false}
          />

          <TextInputLaunchpad<CollectionFormValues>
            name="coverImageUri"
            label="Cover Image URI"
            placeHolder="ipfs://"
            form={collectionForm}
            required={false}
          />
        </View>
      </View>
    </View>
  );
};
