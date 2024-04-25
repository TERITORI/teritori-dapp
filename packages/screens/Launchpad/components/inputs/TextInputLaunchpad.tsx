import React, { useRef, useState } from "react";
import {
  FieldValues,
  Path,
  useController,
  UseFormReturn,
} from "react-hook-form";
import { TextInput, TextInputProps, TextStyle } from "react-native";

import { ErrorText } from "@/components/ErrorText";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { Label } from "@/components/inputs/TextInputCustom";
import { SpacerColumn } from "@/components/spacer";
import { neutral22, neutral77, secondaryColor } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

interface TextInputLaunchpadProps<T extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder: string;
  form: UseFormReturn<T>;
  name: Path<T>;
  sublabel?: React.ReactElement;
  valueModifier?: (value: string) => string;
  required?: boolean;
}

export const TextInputLaunchpad = <T extends FieldValues>({
  form,
  name,
  label,
  placeHolder,
  sublabel,
  valueModifier,
  required = true,
  ...restProps
}: TextInputLaunchpadProps<T>) => {
  const inputRef = useRef<TextInput>(null);
  const [hovered, setHovered] = useState(false);
  const { fieldState, field } = useController<T>({
    name,
    control: form.control,
  });
  return (
    <CustomPressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={() => inputRef?.current?.focus()}
      style={{ width: "100%", marginBottom: layout.spacing_x2 }}
    >
      <Label hovered={hovered} isRequired={required}>
        {label}
      </Label>
      {sublabel && sublabel}
      <SpacerColumn size={1.5} />
      <TertiaryBox
        style={[
          {
            backgroundColor: neutral22,
            justifyContent: "center",
            paddingHorizontal: layout.spacing_x1_5,
            height: 40,
          },
          hovered && { borderColor: secondaryColor },
        ]}
      >
        <TextInput
          placeholder={placeHolder}
          placeholderTextColor={neutral77}
          style={[
            fontSemibold14,
            {
              color: secondaryColor,
              width: "100%",
            },
            { outlineStyle: "none" } as TextStyle,
          ]}
          onChangeText={(text) =>
            valueModifier
              ? field.onChange(valueModifier(text))
              : field.onChange(text)
          }
          value={field.value || ""}
          ref={inputRef}
          {...restProps}
        />
      </TertiaryBox>

      <ErrorText>{fieldState.error?.message}</ErrorText>
    </CustomPressable>
  );
};
