import React from "react";

import { TextInputCustom } from "../../../inputs/TextInputCustom";
import { TextInputOutsideLabel } from "../../../inputs/TextInputOutsideLabel";

interface TDescriptionInputProps {
  description: any;
  setDescription: any;
}

export const MapDescriptionInput: React.FC<TDescriptionInputProps> = ({
  description,
  setDescription,
}) => {
  return (
    <>
      <TextInputOutsideLabel label="Describe for people that will find this track on map" />
      <TextInputCustom
        noBrokenCorners
        label=""
        hideLabel
        name="description"
        placeHolder="Description"
        multiline
        numberOfLines={4}
        onChangeText={setDescription}
        value={description}
      />
    </>
  );
};
