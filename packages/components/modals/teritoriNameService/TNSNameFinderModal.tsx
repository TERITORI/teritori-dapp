import React, { useEffect } from "react";
import { View, useWindowDimensions } from "react-native";

import { useTNS } from "../../../context/TNSProvider";
import {
  additionalRed,
  neutral33,
  neutral77,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { modalWidthRatio, smallMobileWidth } from "../../../utils/style/layout";
import { NameFinderFormType } from "../../../utils/types/tns";
import { BrandText } from "../../BrandText";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { TextInputCustom } from "../../inputs/TextInputCustom";
import ModalBase from "../ModalBase";

const AVAILABLE_DOMAINS = [".tori"];
const COMING_SOON_DOMAINS = [".rioter"];

const DomainsAvailability = () => {
  return (
    <View
      style={{
        padding: 20,
        borderTopWidth: 1,
        borderColor: neutral33,
        width: "100%",
      }}
    >
      <BrandText
        style={[
          fontSemibold14,
          {
            color: neutral77,
            lineHeight: 16,
          },
        ]}
      >
        Available domains:
      </BrandText>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {AVAILABLE_DOMAINS.map((domain) => (
          <BrandText
            key={domain}
            style={[
              fontSemibold14,
              {
                color: additionalRed,
                lineHeight: 20,
                marginRight: 5,
              },
            ]}
          >
            {domain}
          </BrandText>
        ))}
      </View>
      <BrandText
        style={[
          fontSemibold14,
          {
            color: neutral77,
            marginTop: 20,
          },
        ]}
      >
        Coming soon domains:
      </BrandText>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {COMING_SOON_DOMAINS.map((domain) => (
          <BrandText
            key={domain}
            style={[
              fontSemibold14,
              {
                color: neutral77,
                lineHeight: 20,
                marginRight: 5,
              },
            ]}
          >
            {domain}
          </BrandText>
        ))}
        <BrandText
          style={[
            fontSemibold14,
            {
              color: neutral77,
              lineHeight: 20,
            },
          ]}
        >
          and more
        </BrandText>
      </View>
    </View>
  );
};

export const TNSNameFinderModal: React.FC<{
  visible?: boolean;
  onClose: () => void;
  onEnter: () => void;
}> = ({ visible, onClose, onEnter }) => {
  const { name, setName } = useTNS();

  const onPressEnter = () => {
    if (name) {
      onEnter();
    }
  };

  useEffect(() => {
    // Reset the name each time the modal appears
    if (visible) setName("");
  }, [visible]);

  const { width } = useWindowDimensions();

  return (
    <ModalBase
      visible={visible}
      onClose={onClose}
      label="Find a name"
      childrenBottom={<DomainsAvailability />}
      width={width < smallMobileWidth ? modalWidthRatio * width : 457}
    >
      <TextInputCustom<NameFinderFormType>
        name="name"
        label="NAME"
        placeHolder="Type name here"
        onPressEnter={onPressEnter}
        onChangeText={setName}
        value={name}
        regexp={new RegExp(/^[a-zA-Z]+$/)}
        style={{ marginBottom: 20, width: "100%" }}
      />
      <PrimaryButton
        size="M"
        text="Find"
        touchableStyle={{ marginBottom: 20 }}
        fullWidth
        disabled={!name}
        onPress={onPressEnter}
      />
    </ModalBase>
  );
};
