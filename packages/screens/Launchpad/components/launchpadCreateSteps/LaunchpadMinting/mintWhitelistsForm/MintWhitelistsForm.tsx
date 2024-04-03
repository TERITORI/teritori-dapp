import React, { FC, Fragment, useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

import addSVG from "@/assets/icons/add-secondary.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNetworkFeature, NetworkFeature } from "@/networks";
import {
  CollectionFormValues,
  WhitelistAccordionElem,
} from "@/screens/Launchpad/CreateCollection.type";
import { LaunchpadMintWhitelistAccordionForm } from "@/screens/Launchpad/components/launchpadCreateSteps/LaunchpadMinting/mintWhitelistsForm/LaunchpadMintWhitelistAccordionForm";
import { secondaryColor } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const MintWhitelistsForm: FC = () => {
  const selectedWallet = useSelectedWallet();
  const networkId = selectedWallet?.networkId || "";
  const collectionForm = useFormContext<CollectionFormValues>();

  const whitelistMintInfos = collectionForm.watch("whitelistMintInfos") || [];

  const whitelistMintInfosFieldArray = useFieldArray({
    control: collectionForm.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "whitelistMintInfos", // unique name for your Field Array
  });

  const closeAll = () => {
    whitelistMintInfosFieldArray.fields.map((elem, index) => {
      whitelistMintInfosFieldArray.update(index, { ...elem, isOpen: false });
    });
  };

  const createNewWhitelist = useCallback(() => {
    closeAll();
    const feature = getNetworkFeature(
      networkId,
      NetworkFeature.CosmWasmPremiumFeed,
    );
    if (!feature) {
      throw new Error("This network does not support premium feed");
    }
    const newElem: WhitelistAccordionElem = {
      isOpen: true,
      addressesCount: 0,
      denom: "",
      endTime: 0,
      perAddressLimit: 0,
      merkleRoot: "",
      startTime: 0,
      unitPrice: "",
    };

    whitelistMintInfosFieldArray.append(newElem);
  }, [whitelistMintInfos, networkId]);

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
        {whitelistMintInfosFieldArray.fields.map((elem, index) => {
          return (
            <Fragment key={elem.id}>
              <SpacerColumn size={2} />
              <LaunchpadMintWhitelistAccordionForm
                remove={whitelistMintInfosFieldArray.remove}
                update={whitelistMintInfosFieldArray.update}
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
            onPress={createNewWhitelist}
          >
            <SVG source={addSVG} width={10} height={10} />
            <SpacerRow size={1} />
            <BrandText
              style={[
                fontSemibold14,
                { color: secondaryColor, lineHeight: layout.spacing_x2 },
              ]}
            >
              Add Whitelist
            </BrandText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
