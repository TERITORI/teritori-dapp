import React, { FC, Fragment, useCallback, useEffect, useMemo } from "react";
import {
  useFieldArray,
  useForm,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
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
  WhitelistsAccordion,
} from "@/screens/Launchpad/CreateCollection.type";
import {
  LaunchpadMintWhitelistAccordionForm,
  WhitelistsAccordionField,
} from "@/screens/Launchpad/components/launchpadCreateSteps/LaunchpadMinting/mintWhitelistsForm/LaunchpadMintWhitelistAccordionForm";
import { secondaryColor } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const MintWhitelistsForm: FC<{
  collectionForm: UseFormReturn<CollectionFormValues>;
}> = ({ collectionForm }) => {
  const selectedWallet = useSelectedWallet();
  const networkId = selectedWallet?.networkId || "";

  const whitelistMintInfos = collectionForm.watch("whitelistMintInfos");
  const { control } = useForm<WhitelistsAccordion>({
    defaultValues: {
      whitelists: whitelistMintInfos || [],
    },
  });

  const {
    fields: defaultWhitelists,
    remove,
    append,
    update,
  } = useFieldArray({
    control,
    name: "whitelists",
  });
  const whitelists = useWatch({ control, name: "whitelists" });
  const displayedWhitelists: WhitelistsAccordionField[] = useMemo(
    () =>
      whitelists.map((elem, index) => ({
        ...defaultWhitelists[index],
        ...elem,
      })),
    [defaultWhitelists, whitelists],
  );

  // Update collectionForm
  useEffect(() => {
    collectionForm.setValue("whitelistMintInfos", defaultWhitelists);
  }, [defaultWhitelists, collectionForm]);

  const closeOtherElems = useCallback(
    (elemIndex: number) => {
      displayedWhitelists.map((elem, index) => {
        if (index !== elemIndex) {
          update(index, {
            ...elem,
            isOpen: false,
          });
        }
      });
    },
    [displayedWhitelists, update],
  );

  const createNewWhitelist = useCallback(() => {
    // Close all elems
    displayedWhitelists.map((elem, index) => {
      update(index, {
        ...elem,
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
      addressesCount: 0,
      denom: "",
      endTime: 0,
      perAddressLimit: 0,
      merkleRoot: "",
      startTime: 0,
      unitPrice: "",
    };
    append(newElem);
  }, [append, networkId, displayedWhitelists, update]);

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
        {displayedWhitelists.map((elem, index) => {
          return (
            <Fragment key={index}>
              <SpacerColumn size={2} />
              <LaunchpadMintWhitelistAccordionForm
                closeOtherElems={closeOtherElems}
                elem={elem}
                elemIndex={index}
                // FIXME: remove()
                remove={() => remove(index)}
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
