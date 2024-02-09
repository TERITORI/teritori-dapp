import React, { useState } from "react";

import { AccordionBottomComponent } from "./AccordionBottomComponent";
import { AccordionTopComponent } from "./AccordionTopComponent";
import defaultTierImage from "../../../../../assets/default-images/default-tier-thumbnail.png";
import { layout } from "../../../../utils/style/layout";

import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { neutral22, neutral33 } from "@/utils/style/colors";
import { LocalFileData } from "@/utils/types/files";

interface AccordionProps {
  onRemoveItem: () => void;
}

export const AccordionComponent = ({ onRemoveItem }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<LocalFileData[]>([]);

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
        image={
          files.length > 0
            ? URL.createObjectURL(files[0].file)
            : defaultTierImage
        }
      />

      {isOpen && (
        <AccordionBottomComponent
          onRemoveItem={onRemoveItem}
          image={files.length > 0 ? URL.createObjectURL(files[0].file) : ""}
          setFiles={setFiles}
        />
      )}
    </PrimaryBox>
  );
};
