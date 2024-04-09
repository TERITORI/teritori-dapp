import React, { FC } from "react";
import { UseFieldArrayRemove, UseFieldArrayUpdate } from "react-hook-form";

import { LaunchpadMintPeriodAccordionFormBottom } from "./LaunchpadMintPeriodAccordionFormBottom";
import { LaunchpadMintPeriodAccordionFormTop } from "./LaunchpadMintPeriodAccordionFormTop";

import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { neutral00, neutral22, neutral33 } from "@/utils/style/colors";
import {
  CollectionFormValues,
  CollectionMintPeriodFormValues,
} from "@/utils/types/launchpad";

export const LaunchpadMintPeriodAccordionForm: FC<{
  elem: CollectionMintPeriodFormValues;
  elemIndex: number;
  remove: UseFieldArrayRemove;
  update: UseFieldArrayUpdate<CollectionFormValues>;
  closeAll: () => void;
}> = ({ elem, elemIndex, remove, update, closeAll }) => {
  return (
    <PrimaryBox
      style={{
        borderColor: neutral33,
        backgroundColor: elem.isOpen ? neutral00 : neutral22,
        borderWidth: 1,
      }}
    >
      <LaunchpadMintPeriodAccordionFormTop
        update={update}
        elem={elem}
        elemIndex={elemIndex}
        closeAll={closeAll}
      />

      {elem.isOpen && (
        <LaunchpadMintPeriodAccordionFormBottom
          update={update}
          remove={remove}
          elem={elem}
          elemIndex={elemIndex}
        />
      )}
    </PrimaryBox>
  );
};
