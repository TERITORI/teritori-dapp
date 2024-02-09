import React, { FC, useCallback, useState } from "react";

import { AccordionBottomComponent } from "./AccordionBottomComponent";
import { AccordionTopComponent } from "./AccordionTopComponent";
import { layout } from "../../../../utils/style/layout";

import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { neutral22, neutral33 } from "@/utils/style/colors";
import { LocalFileData } from "@/utils/types/files";
import { LocalMembershipConfig } from "@/utils/types/premiumFeed";

interface AccordionProps {
  networkId: string;
  tier: LocalMembershipConfig;
  tierIndex: number;
  onChangeTier: (
    index: number,
    cb: (oldTier: LocalMembershipConfig) => LocalMembershipConfig,
  ) => void;
  onRemoveItem: () => void;
}

export const AccordionComponent: FC<AccordionProps> = ({
  networkId,
  onRemoveItem,
  onChangeTier,
  tier,
  tierIndex,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<LocalFileData[]>([]);

  const handleChangeTier = useCallback(
    (cb: (oldTier: LocalMembershipConfig) => LocalMembershipConfig) =>
      onChangeTier(tierIndex, cb),
    [tierIndex, onChangeTier],
  );

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
      <AccordionTopComponent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        tier={tier}
        tierIndex={tierIndex}
        onChangeTier={handleChangeTier}
      />

      {isOpen && (
        <AccordionBottomComponent
          networkId={networkId}
          onRemoveItem={onRemoveItem}
          tier={tier}
          tierIndex={tierIndex}
          onChangeTier={handleChangeTier}
          image={files.length > 0 ? URL.createObjectURL(files[0].file) : ""}
          setFiles={setFiles}
        />
      )}
    </PrimaryBox>
  );
};
