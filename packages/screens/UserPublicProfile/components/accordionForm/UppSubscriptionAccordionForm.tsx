import React, { FC } from "react";
import {
  Control,
  FieldArrayWithId,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
} from "react-hook-form";

import { UPPSubscriptionAccordionFormBottom } from "./UPPSubscriptionAccordionFormBottom";
import { UPPSubscriptionAccordionFormTop } from "./UPPSubscriptionAccordionFormTop";

import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { neutral22, neutral33 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";
import { SubscriptionFormValues } from "@/utils/types/premium-feed";

interface AccordionProps {
  networkId: string;
  control: Control<SubscriptionFormValues>;
  elem: FieldArrayWithId<SubscriptionFormValues, "tiers", "id">;
  elemIndex: number;
  update: UseFieldArrayUpdate<SubscriptionFormValues, "tiers">;
  remove: UseFieldArrayRemove;
  setIsLoading?: (value: boolean) => void;
}

export const UppSubscriptionAccordionForm: FC<AccordionProps> = ({
  networkId,
  control,
  elem,
  elemIndex,
  remove,
  update,
  setIsLoading,
}) => {
  return (
    <PrimaryBox
      style={{
        borderColor: neutral33,
        backgroundColor: neutral22,
        borderWidth: 1,
        margin: layout.spacing_x1,
        padding: layout.spacing_x1,
      }}
    >
      <UPPSubscriptionAccordionFormTop
        isOpen={elem.open}
        networkId={networkId}
        setIsOpen={(value) => {
          update(elemIndex, { ...elem, open: value });
        }}
        control={control}
        elem={elem}
        elemIndex={elemIndex}
      />

      {elem.open && (
        <UPPSubscriptionAccordionFormBottom
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
