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

export type WhitelistField = FieldArrayWithId<
  WhitelistsAccordion,
  "whitelists",
  "id"
>;

export interface LaunchpadWhitelistsAccordionFormProps {
  networkId: string;
  control: Control<WhitelistsAccordion>;
  elem: FieldArrayWithId<WhitelistsAccordion, "whitelists", "id">;
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
  elem,
  elemIndex,
  closeOtherElems,
  remove,
  update,
  setIsLoading,
}) => {
  return (
    <PrimaryBox
      style={{
        borderColor: neutral33,
        backgroundColor: elem.isOpen ? neutral00 : neutral22,
        borderWidth: 1,
      }}
    >
      <LaunchpadMintWhitelistAccordionFormTop
        networkId={networkId}
        setIsOpen={(isOpen) => {
          console.log("isOpenisOpen", isOpen);
          update(elemIndex, { ...elem, isOpen });
          if (isOpen) closeOtherElems(elemIndex);
        }}
        control={control}
        elem={elem}
        elemIndex={elemIndex}
      />

      {elem.isOpen && (
        <LaunchpadMintWhitelistAccordionFormBottom
          networkId={networkId}
          control={control}
          elem={elem}
          update={update}
          elemIndex={elemIndex}
          remove={remove}
          setIsLoading={setIsLoading}
        />
      )}
    </PrimaryBox>
  );
};
