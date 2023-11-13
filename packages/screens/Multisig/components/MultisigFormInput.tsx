import React from "react";
import { FieldValues, useWatch } from "react-hook-form";
import { Pressable } from "react-native";

import copySVG from "../../../../assets/icons/copy.svg";
import { BrandText } from "../../../components/BrandText";
import { useCopyToClipboard } from "../../../components/CopyToClipboard";
import { SVG } from "../../../components/SVG";
import { MaxButton } from "../../../components/buttons/MaxButton";
import {
  TextInputCustom,
  TextInputCustomProps,
} from "../../../components/inputs/TextInputCustom";
import { SpacerRow } from "../../../components/spacer";
import { neutral55, neutral77, neutralA3 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";

interface MultisigFormInputProps<T extends FieldValues>
  extends TextInputCustomProps<T> {
  isCopiable?: boolean;
  tiker?: string;
  isDisabled?: boolean;
  isOverrideDisabledBorder?: boolean;
  onPressMax?: () => void;
}

export const MultisigFormInput = <T extends FieldValues>({
  isCopiable,
  tiker,
  isDisabled,
  isOverrideDisabledBorder,
  onPressMax,
  ...restProps
}: MultisigFormInputProps<T>) => {
  const { copyToClipboard } = useCopyToClipboard();
  const value = useWatch<T>({
    control: restProps.control,
    name: restProps.name,
  });

  const onPressCopy = () =>
    copyToClipboard(value || restProps.defaultValue || "");

  return (
    <TextInputCustom<T>
      variant="labelOutside"
      noBrokenCorners
      labelStyle={{ color: neutralA3 }}
      disabled={isDisabled}
      placeholderTextColor={neutral55}
      {...restProps}
    >
      {isCopiable && (
        <>
          <SpacerRow size={3} />
          <Pressable
            onPress={onPressCopy}
            style={{
              position: "absolute",
              right: 0,
            }}
          >
            <SVG source={copySVG} width={24} height={24} />
          </Pressable>
        </>
      )}
      {tiker && (
        <>
          <SpacerRow size={3} />
          <BrandText
            style={[
              fontSemibold14,
              { color: neutral77, textTransform: "uppercase" },
            ]}
          >
            {tiker}
          </BrandText>
        </>
      )}
      {onPressMax && <MaxButton onPress={onPressMax} />}
    </TextInputCustom>
  );
};
