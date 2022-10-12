import React from "react";
import { TouchableOpacity, View } from "react-native";

import {
  neutral33,
  primaryColor,
  primaryTextColor,
} from "../../utils/style/colors";
import { BrandText } from "../BrandText";

type ButtonPropType = {
  label: string;
  value: string;
};

export interface FormButtonGroupProps {
  buttons: ButtonPropType[];
  onChange: () => void;
  value: string;
}

interface ButtonProps {
  value: string;
  button: ButtonPropType;
  onChange: (value: string) => void;
  index: number;
  buttonsCount: number;
}

const Button: React.FC<ButtonProps> = ({ value, button, onChange }) => {
  const isSelected = value === button.value;
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onChange(button.value)}
      style={{
        backgroundColor: isSelected ? primaryColor : "transparent",
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center",
        height: 56,
        flex: 1,
      }}
    >
      <BrandText
        style={{
          color: isSelected ? primaryTextColor : "white",
          fontSize: 20,
        }}
      >
        {button.label}
      </BrandText>
    </TouchableOpacity>
  );
};

export const FormButtonGroup: React.FC<FormButtonGroupProps> = ({
  buttons,
  onChange,
  value,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: neutral33,
        padding: 2,
        borderRadius: 10,
      }}
    >
      {buttons.map((button, index) => (
        <Button
          key={button.value}
          value={value}
          button={button}
          index={index}
          buttonsCount={buttons.length}
          onChange={onChange}
        />
      ))}
    </View>
  );
};
