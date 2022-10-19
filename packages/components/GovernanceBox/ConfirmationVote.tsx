import React, { useState } from "react";
import { View, StyleProp, ViewStyle } from "react-native";

import checklogo from "../../../assets/icons/checklogo.svg";
import { BrandText } from "../../components/BrandText/BrandText";
import ModalBase from "../../components/modals/ModalBase";
import { neutral44 } from "../../utils/style/colors";
import { SVG } from "../SVG";

const Separator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
  <View
    style={[
      { borderBottomWidth: 1, borderColor: neutral44, width: "100%" },
      style,
    ]}
  />
);

export const ConfirmationVote: React.FC<{
  visible?: boolean;
  onClose: () => void;
  numberProposal: string;
  vote: string;
}> = ({ visible, onClose, numberProposal, vote }) => {
  const [displayConfirmation, setDisplayConfirmation] = useState(visible);
  function handleConfirmClick() {
    onClose();
    setDisplayConfirmation(false);
  }

  return (
    <ModalBase
      onClose={() => {
        handleConfirmClick();
        console.log(displayConfirmation);
      }}
      label="Successful vote"
      visible={displayConfirmation}
      width={372}
      childrenBottom={
        <>
          <Separator />

          <View
            style={{
              flexDirection: "column",
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "flex-start",
              height: 80,
              width: 300,
              marginLeft: 10,
            }}
          >
            <View>
              <View>
                <BrandText
                  style={{
                    fontSize: 16,
                    color: "#777777",
                    marginTop: 20,
                  }}
                >
                  You have successfully voted{" "}
                  <BrandText
                    style={{
                      fontSize: 16,
                      color: "#FFFFFF",
                    }}
                  >
                    {vote}
                  </BrandText>
                </BrandText>
              </View>
            </View>

            <View>
              <BrandText
                style={{
                  fontSize: 16,
                  color: "#777777",
                  marginBottom: 20,
                }}
              >
                on proposal{" "}
                <BrandText
                  style={{
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                >
                  #{numberProposal}
                </BrandText>
              </BrandText>
            </View>
          </View>
        </>
      }
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
          marginBottom: 40,
        }}
      >
        <SVG width={172} height={172} source={checklogo} />
      </View>
    </ModalBase>
  );
};
