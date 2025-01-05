import { FC } from "react";
import { UseFieldArrayRemove, UseFieldArrayUpdate } from "react-hook-form";

import { LaunchpadMintPeriodAccordionBottom } from "./LaunchpadMintPeriodAccordionBottom";
import { LaunchpadMintPeriodAccordionTop } from "./LaunchpadMintPeriodAccordionTop";

import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { neutral00, neutral22, neutral33 } from "@/utils/style/colors";
import {
  CollectionFormValues,
  CollectionMintPeriodFormValues,
} from "@/utils/types/launchpad";

export const LaunchpadMintPeriodAccordion: FC<{
  elem: CollectionMintPeriodFormValues;
  elemIndex: number;
  remove: UseFieldArrayRemove;
  update: UseFieldArrayUpdate<CollectionFormValues, "mintPeriods">;
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
      <LaunchpadMintPeriodAccordionTop
        update={update}
        elem={elem}
        elemIndex={elemIndex}
        closeAll={closeAll}
      />

      {elem.isOpen && (
        <LaunchpadMintPeriodAccordionBottom
          update={update}
          remove={remove}
          elem={elem}
          elemIndex={elemIndex}
        />
      )}
    </PrimaryBox>
  );
};
