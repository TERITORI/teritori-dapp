import React, { FC, Fragment, useCallback } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

import addSVG from "@/assets/icons/add-secondary.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNetworkFeature, NetworkFeature } from "@/networks";
import {
  WhitelistAccordionElem,
  WhitelistsAccordion,
} from "@/screens/Launchpad/CreateCollection.type";
import { LaunchpadMintWhitelistAccordionForm } from "@/screens/Launchpad/components/launchpadCreateSteps/LaunchpadMinting/mintWhitelistsForm/LaunchpadMintWhitelistAccordionForm";
import { secondaryColor } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const MintWhitelistsForm: FC = () => {
  const selectedWallet = useSelectedWallet();
  const networkId = selectedWallet?.networkId || "";

  const { control } = useForm<WhitelistsAccordion>({
    defaultValues: {
      whitelists: [],
    },
  });

  const {
    fields: whitelists,
    remove,
    append,
    update,
  } = useFieldArray({
    control,
    name: "whitelists",
  });

  const createNewWhitelist = useCallback(() => {
    // Close all elems
    whitelists.map((whitelist, index) => {
      update(index, {
        ...whitelist,
        isOpen: false,
      });
    });

    const feature = getNetworkFeature(
      networkId,
      NetworkFeature.CosmWasmPremiumFeed,
    );
    if (!feature) {
      throw new Error("This network does not support premium feed");
    }
    const newElem: WhitelistAccordionElem = {
      isOpen: true,
    };
    append(newElem);
  }, [append, networkId, whitelists, update]);

  const closeOtherElems = useCallback(
    (elemIndex: number) => {
      whitelists.map((whitelist, index) => {
        if (index !== elemIndex) {
          update(index, {
            ...whitelist,
            isOpen: false,
          });
        }
      });
    },
    [whitelists, update],
  );

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
        {whitelists.map((elem, index) => {
          return (
            <Fragment key={index}>
              <SpacerColumn size={2} />
              <LaunchpadMintWhitelistAccordionForm
                closeOtherElems={closeOtherElems}
                elem={elem}
                elemIndex={index}
                remove={() => remove(index)}
                // setIsLoading={(value) => {
                //   setLoadStates((prev) => ({ ...prev, [index]: value }));
                // }}
                update={update}
                networkId={networkId}
                control={control}
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
