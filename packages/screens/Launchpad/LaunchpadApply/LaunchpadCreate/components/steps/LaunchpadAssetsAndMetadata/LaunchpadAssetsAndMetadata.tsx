import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { View } from "react-native";

import { AssetsAndMetadataInputs } from "./AssetsAndMetadataInputs";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { neutral77, primaryColor } from "@/utils/style/colors";
import { fontMedium14, fontMedium28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {
  CollectionAssetsMetadatasFormValues,
  CollectionFormValues,
  ZodCollectionAssetsMetadatasFormValues,
} from "@/utils/types/launchpad";

interface Props {
  collectionForm: UseFormReturn<CollectionFormValues>;
}

export const LaunchpadAssetsAndMetadata: FC<Props> = ({ collectionForm }) => {
  const isMobile = useIsMobile();
  const collectionAssetsMetadatas = collectionForm.watch("assetsMetadatas");
  const assetsMetadatasForm = useForm<CollectionAssetsMetadatasFormValues>({
    mode: "all",
    defaultValues: collectionAssetsMetadatas, // Retrieve assetsMetadatas from collectionForm
    resolver: zodResolver(ZodCollectionAssetsMetadatasFormValues),
  });
  const assetsMetadatas = assetsMetadatasForm.watch("assetsMetadatas");

  // Plug assetsMetadatas from assetsMetadatasForm to collectionForm
  useEffect(() => {
    collectionForm.setValue("assetsMetadatas.assetsMetadatas", assetsMetadatas);
  }, [assetsMetadatas, collectionForm]);

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        paddingHorizontal: isMobile ? 0 : layout.spacing_x3,
        marginBottom: 100,
      }}
    >
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <BrandText style={fontMedium28}>Assets & Metadata</BrandText>

        <SpacerColumn size={2} />

        <BrandText
          style={[
            fontMedium14,
            {
              color: neutral77,
            },
          ]}
        >
          Make sure you check out{" "}
          <BrandText
            style={[
              fontMedium14,
              {
                color: primaryColor,
              },
            ]}
          >
            documentation
          </BrandText>{" "}
          on how to create your collection
        </BrandText>
      </View>

      <SpacerColumn size={2} />

      <AssetsAndMetadataInputs assetsMetadatasForm={assetsMetadatasForm} />
    </View>
  );
};
