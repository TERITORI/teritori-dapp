import React, { useState } from "react";
import {
  FieldValues,
  Path,
  useController,
  UseFormReturn,
} from "react-hook-form";
import { TextInput, TextInputProps, TextStyle, View } from "react-native";

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
  required?: boolean;
}

export const TextInputLaunchpad = <T extends FieldValues>({
  form,
  name,
  label,
  placeHolder,
  sublabel,
  required = true,
}: TextInputLaunchpadProps<T>) => {
  const [hovered, setHovered] = useState(false);
  const { fieldState, field } = useController<T>({
    name,
    control: form.control,
    rules: { required },
  });
  return (
    <CustomPressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={() => form.setFocus(name)}
      style={{ width: "100%", marginBottom: layout.spacing_x2 }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Label hovered={hovered} isRequired={required}>
          {label}
        </Label>
      </View>
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
          onChangeText={(text) => field.onChange(text)}
          {...form.register(name)}
        />
      </TertiaryBox>

      <ErrorText>{fieldState.error?.message}</ErrorText>
    </CustomPressable>
  );
};
