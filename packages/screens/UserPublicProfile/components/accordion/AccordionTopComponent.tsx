import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View, TouchableOpacity } from "react-native";

import chevronDownSVG from "./../../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "./../../../../../assets/icons/chevron-up.svg";
import { layout } from "../../../../utils/style/layout";

import { BrandText } from "@/components/BrandText";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SVG } from "@/components/SVG";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { TextInputOutsideLabel } from "@/components/inputs/TextInputOutsideLabel";
import { neutral77, neutralA3, secondaryColor } from "@/utils/style/colors";
import { fontSemibold16 } from "@/utils/style/fonts";

interface AccordionTopProps {
  isOpen: boolean;
  setIsOpen: (item: boolean) => void;
  image: string;
}

interface SubscriptionFormValues {
  title: string;
  price: string;
  duration: string;
  description: string;
}

export const AccordionTopComponent = ({
  isOpen,
  setIsOpen,
  image,
}: AccordionTopProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const { control, watch } = useForm<SubscriptionFormValues>({
    defaultValues: {
      title: "",
    },
    mode: "onBlur",
  });

  if (isOpen) {
    return (
      <View
        style={{
          borderBottomColor: neutral77,
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          height: 32,
        }}
      >
        {isFocused ? (
          <TextInputCustom<SubscriptionFormValues>
            hideLabel
            noBrokenCorners
            rules={{ required: true }}
            placeHolder="Tier name"
            placeholderTextColor={neutralA3}
            name="title"
            control={control}
            label="Tier name"
            variant="noStyle"
            onBlur={() => setIsFocused(false)}
          />
        ) : (
          <TouchableOpacity
            onPress={() => {
              setIsFocused(true);
            }}
          >
            <TextInputOutsideLabel label="Tier name" isAsterickSign />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            setIsOpen(false);
          }}
        >
          <SVG
            source={chevronUpSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        style={{ flexDirection: "row", justifyContent: "space-between" }}
        onPress={() => {
          setIsOpen(!isOpen);
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <OptimizedImage
            sourceURI={image}
            style={{
              height: 48,
              width: 48,
              borderRadius: 8,
            }}
            height={48}
            width={48}
          />
          <BrandText
            style={[
              fontSemibold16,
              { color: secondaryColor, marginLeft: layout.spacing_x1 },
            ]}
          >
            {watch("title")}
          </BrandText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SVG
            source={chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </View>
      </TouchableOpacity>
    );
  }
};
