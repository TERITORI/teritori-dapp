import React, { FC } from "react";
import {
  Control,
  FieldArrayWithId,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
} from "react-hook-form";

import { LaunchpadMintWhitelistAccordionFormBottom } from "./LaunchpadMintWhitelistAccordionFormBottom";
import { LaunchpadMintWhitelistAccordionFormTop } from "./LaunchpadMintWhitelistAccordionFormTop";

import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { WhitelistsAccordion } from "@/screens/Launchpad/CreateCollection.type";
import { neutral00, neutral22, neutral33 } from "@/utils/style/colors";

export type WhitelistsAccordionField = FieldArrayWithId<
  WhitelistsAccordion,
  "whitelists"
>;

export interface LaunchpadWhitelistsAccordionFormProps {
  networkId: string;
  control: Control<WhitelistsAccordion>;
  elem: WhitelistsAccordionField;
  elemIndex: number;
  closeOtherElems: (elemIndex: number) => void;
  update: UseFieldArrayUpdate<WhitelistsAccordion, "whitelists">;
  remove: UseFieldArrayRemove;
  setIsLoading?: (value: boolean) => void;
}

export const LaunchpadMintWhitelistAccordionForm: FC<
  LaunchpadWhitelistsAccordionFormProps
> = ({
  networkId,
  control,
  update,
  remove,
  elem,
  elemIndex,
  closeOtherElems,
  setIsLoading,
}) => {
  const setIsOpen = (isOpen: boolean) => {
    update(elemIndex, { ...elem, isOpen });
    closeOtherElems(elemIndex);
  };

  return (
    <PrimaryBox
      style={{
        borderColor: neutral33,
        backgroundColor: elem.isOpen ? neutral00 : neutral22,
        borderWidth: 1,
      }}
    >
      <LaunchpadMintWhitelistAccordionFormTop
        control={control}
        networkId={networkId}
        setIsOpen={setIsOpen}
        elem={elem}
        elemIndex={elemIndex}
      />

      {elem.isOpen && (
        <LaunchpadMintWhitelistAccordionFormBottom
          control={control}
          networkId={networkId}
          elem={elem}
          elemIndex={elemIndex}
          setIsLoading={setIsLoading}
          remove={remove}
          update={update}
        />
      )}
    </PrimaryBox>
  );
};
