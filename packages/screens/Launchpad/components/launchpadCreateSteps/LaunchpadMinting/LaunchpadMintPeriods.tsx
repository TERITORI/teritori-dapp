import React, { FC, Fragment, useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

import addSVG from "@/assets/icons/add-secondary.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNetworkFeature, NetworkFeature } from "@/networks";
import { LaunchpadMintPeriodAccordion } from "@/screens/Launchpad/components/launchpadCreateSteps/LaunchpadMinting/LaunchpadMintPeriodAccordion";
import { secondaryColor } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { CollectionFormValues } from "@/utils/types/launchpad";

export const LaunchpadMintPeriods: FC = () => {
  const selectedWallet = useSelectedWallet();
  const networkId = selectedWallet?.networkId || "";
  const collectionForm = useFormContext<CollectionFormValues>();
  const selectedNetwork = useSelectedNetworkInfo();

  const { fields, update, append, remove } = useFieldArray({
    control: collectionForm.control,
    name: "mintPeriods",
  });
  const closeAll = useCallback(() => {
    fields.map((elem, index) => {
      update(index, { ...elem, isOpen: false });
    });
  }, [fields, update]);

  const createMintPeriod = useCallback(() => {
    if (!selectedNetwork) return;
    closeAll();
    const feature = getNetworkFeature(networkId, NetworkFeature.NFTLaunchpad);
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
        {fields.map((elem, index) => {
          return (
            <Fragment key={index}>
              <SpacerColumn size={2} />
              <LaunchpadMintPeriodAccordion
                remove={remove}
                update={update}
                closeAll={closeAll}
                elem={elem}
                elemIndex={index}
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
                fontSemibold14,
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
