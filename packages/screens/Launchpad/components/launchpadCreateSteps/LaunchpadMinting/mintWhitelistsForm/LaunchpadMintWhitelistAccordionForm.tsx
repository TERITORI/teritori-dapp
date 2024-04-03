import React, { FC } from "react";
import {
  FieldArrayWithId,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
} from "react-hook-form";

import { LaunchpadMintWhitelistAccordionFormBottom } from "./LaunchpadMintWhitelistAccordionFormBottom";
import { LaunchpadMintWhitelistAccordionFormTop } from "./LaunchpadMintWhitelistAccordionFormTop";

import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { CollectionFormValues } from "@/screens/Launchpad/CreateCollection.type";
import { neutral00, neutral22, neutral33 } from "@/utils/style/colors";

export const LaunchpadMintWhitelistAccordionForm: FC<{
  elem: FieldArrayWithId<CollectionFormValues, "whitelistMintInfos", "id">;
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
      <LaunchpadMintWhitelistAccordionFormTop
        update={update}
        elem={elem}
        elemIndex={elemIndex}
        closeAll={closeAll}
      />

      {elem.isOpen && (
        <LaunchpadMintWhitelistAccordionFormBottom
          remove={remove}
          elem={elem}
          elemIndex={elemIndex}
        />
      )}
    </PrimaryBox>
  );
};