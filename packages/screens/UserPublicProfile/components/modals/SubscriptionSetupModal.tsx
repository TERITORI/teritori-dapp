import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";

import addSVG from "./../../../../../assets/icons/add-secondary.svg";
import settingsSVG from "../../../../../assets/icons/settings-primary.svg";
import ModalBase from "../../../../components/modals/ModalBase";
import { layout } from "../../../../utils/style/layout";
import { AccordionComponent } from "../accordion/AccordionComponent";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { Separator } from "@/components/separators/Separator";
import { SpacerRow } from "@/components/spacer";
import {
  neutral22,
  neutral33,
  primaryColor,
  secondaryColor,
} from "@/utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "@/utils/style/fonts";

export const SubscriptionSetupModal: React.FC<{
  onSubmit: () => void;
  isVisible: boolean;
  onClose: () => void;
}> = ({ onSubmit, isVisible, onClose }) => {
  const [tiers, setTiers] = useState([{ id: Math.random() }]);

  const addItem = () => {
    const newItem = { id: Math.random() };
    setTiers([...tiers, newItem]);
  };

  const removeItem = (id: number) => {
    const updatedItems = tiers.filter((item) => item.id !== id);
    setTiers(updatedItems);
  };

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={457}
      hideMainSeparator
      scrollable
      labelComponent={
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <SVG
              source={settingsSVG}
              height={20}
              width={20}
              color={primaryColor}
            />
            <SpacerRow size={1} />

            <BrandText style={[fontSemibold20, { color: secondaryColor }]}>
              Premium Subscription Setup
            </BrandText>
          </View>
        </View>
      }
    >
      <View
        style={{
          alignItems: "center",
          width: "100%",
          marginBottom: layout.spacing_x1,
        }}
      >
        <PrimaryBox
          style={{
            width: "100%",
            borderColor: neutral33,
            backgroundColor: neutral22,
            padding: layout.spacing_x1,
            borderWidth: 1,
          }}
        >
          {tiers.map((tier, index) => {
            return (
              <AccordionComponent
                onRemoveItem={() => {
                  removeItem(tier.id);
                }}
              />
            );
          })}

          <View
            style={{
              marginTop: layout.spacing_x1,
              marginBottom: layout.spacing_x2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                height: 32,
                width: 100,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: secondaryColor,
              }}
              onPress={() => {
                addItem();
              }}
            >
              <SVG source={addSVG} width={16} height={16} />
              <SpacerRow size={1} />
              <BrandText
                style={[
                  fontSemibold14,
                  { color: secondaryColor, lineHeight: layout.spacing_x2 },
                ]}
              >
                Add tier
              </BrandText>
            </TouchableOpacity>
          </View>
          <Separator />

          <View
            style={{
              justifyContent: "center",
              marginVertical: layout.spacing_x1,
              marginTop: layout.spacing_x2,
              flexDirection: "row",
            }}
          >
            <View style={{ marginHorizontal: layout.spacing_x1 }}>
              <SecondaryButton
                width={112}
                size="M"
                text="Cancel"
                loader
                onPress={() => {
                  onClose();
                }}
              />
            </View>

            <View style={{ marginHorizontal: layout.spacing_x1 }}>
              <PrimaryButton
                width={112}
                size="M"
                text="Setup"
                loader
                onPress={() => {
                  onClose();
                }}
              />
            </View>
          </View>
        </PrimaryBox>
      </View>
    </ModalBase>
  );
};
