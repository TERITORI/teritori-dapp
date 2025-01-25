import { FC } from "react";
import {
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormReturn,
} from "react-hook-form";

import { LaunchpadMintPeriodAccordionBottom } from "./LaunchpadMintPeriodAccordionBottom";
import { LaunchpadMintPeriodAccordionTop } from "./LaunchpadMintPeriodAccordionTop";

import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { neutral00, neutral22, neutral33 } from "@/utils/style/colors";
import {
  CollectionFormValues,
  CollectionMintPeriodFormValues,
} from "@/utils/types/launchpad";

interface Props {
  elem: CollectionMintPeriodFormValues;
  elemIndex: number;
  remove: UseFieldArrayRemove;
  update: UseFieldArrayUpdate<CollectionFormValues, "mintPeriods">;
  closeAll: () => void;
  collectionForm: UseFormReturn<CollectionFormValues>;
}

export const LaunchpadMintPeriodAccordion: FC<Props> = ({
  elem,
  elemIndex,
  remove,
  update,
  closeAll,
  collectionForm,
}) => {
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
          collectionForm={collectionForm}
        />
      )}
    </PrimaryBox>
  );
};
