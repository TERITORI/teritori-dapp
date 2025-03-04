import { FC, Fragment, useCallback } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

import addSVG from "@/assets/icons/add-secondary.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import { getNetworkFeature, NetworkFeature } from "@/networks";
import { LaunchpadMintPeriodAccordion } from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/components/steps/LaunchpadMinting/LaunchpadMintPeriodAccordion";
import { secondaryColor } from "@/utils/style/colors";
import { fontMedium14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { CollectionFormValues } from "@/utils/types/launchpad";

interface Props {
  collectionForm: UseFormReturn<CollectionFormValues>;
}

export const LaunchpadMintPeriods: FC<Props> = ({ collectionForm }) => {
  const selectedNetwork = useSelectedNetworkInfo();
  const networkId = selectedNetwork?.id;

  const { update, append, remove } = useFieldArray({
    control: collectionForm.control,
    name: "mintPeriods",
  });
  const mintPeriods = collectionForm.watch("mintPeriods");

  const closeAll = useCallback(() => {
    mintPeriods.map((elem, index) => {
      update(index, { ...elem, isOpen: false });
    });
  }, [mintPeriods, update]);

  const createMintPeriod = useCallback(() => {
    if (!selectedNetwork) return;
    closeAll();
    const feature = getNetworkFeature(
      networkId,
      NetworkFeature.CosmWasmNFTLaunchpad,
    );
    if (!feature) {
      throw new Error("This network does not support nft launchpad");
    }
    append({
      price: { denom: selectedNetwork.currencies[0].denom, amount: "" },
      maxTokens: "",
      perAddressLimit: "",
      startTime: 0,
      endTime: 0,
      isOpen: true,
    });
  }, [networkId, closeAll, append, selectedNetwork]);

  return (
    <View
      style={{
        alignItems: "center",
        width: "100%",
      }}
    >
      <View
        style={{
          width: "100%",
        }}
      >
        {mintPeriods.map((elem, index) => {
          return (
            <Fragment key={index}>
              <SpacerColumn size={2} />
              <LaunchpadMintPeriodAccordion
                remove={remove}
                update={update}
                closeAll={closeAll}
                elem={elem}
                elemIndex={index}
                collectionForm={collectionForm}
              />
            </Fragment>
          );
        })}

        <View
          style={{
            marginTop: layout.spacing_x2,
            marginBottom: layout.spacing_x1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              height: 32,
              paddingHorizontal: layout.spacing_x2,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: secondaryColor,
            }}
            onPress={createMintPeriod}
          >
            <SVG source={addSVG} width={10} height={10} />
            <SpacerRow size={1} />
            <BrandText
              style={[
                fontMedium14,
                { color: secondaryColor, lineHeight: layout.spacing_x2 },
              ]}
            >
              Add Minting Period
            </BrandText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
