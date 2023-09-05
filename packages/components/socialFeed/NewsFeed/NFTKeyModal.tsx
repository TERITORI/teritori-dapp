import React, { useState } from "react";
import { Linking, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { neutral17, primaryColor } from "../../../utils/style/colors";
import { fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { TextInputCustom } from "../../inputs/TextInputCustom";
import ModalBase from "../../modals/ModalBase";

interface NFTKeyModalProps {
  onClose: (key?: string) => void;
}

export const NFTKeyModal: React.FC<NFTKeyModalProps> = ({ onClose }) => {
  const [apiKey, setAPIKey] = useState("");
  return (
    <ModalBase
      visible
      onClose={() => onClose()}
      label="Enter API key"
      width={480}
      scrollable
      hideMainSeparator
      contentStyle={{
        backgroundColor: neutral17,
      }}
    >
      <View style={{ flex: 1 }}>
        <BrandText style={fontSemibold12}>
          Please enter NFT.STORAGE API key
        </BrandText>
        <BrandText style={[fontSemibold12, { marginTop: layout.spacing_x1 }]}>
          To upload files you have to provide API KEY, we will use your key to
          upload the files, the API KEY will be used one time only; and will not
          be saved in our system.
        </BrandText>
        <BrandText style={[fontSemibold12, { marginTop: layout.spacing_x1 }]}>
          To create API key check this site{" "}
          <TouchableOpacity
            onPress={() => Linking.openURL("https://nft.storage/manage/")}
          >
            <BrandText
              style={[
                fontSemibold12,
                {
                  color: primaryColor,
                },
              ]}
            >
              https://nft.storage/manage/
            </BrandText>
          </TouchableOpacity>
        </BrandText>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 20,
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <TextInputCustom<{ apiKey: string }>
              squaresBackgroundColor={neutral17}
              name="apiKey"
              label=""
              value={apiKey}
              onChangeText={setAPIKey}
              containerStyle={{
                width: "100%",
              }}
            />
          </View>

          <PrimaryButton
            squaresBackgroundColor={neutral17}
            text="Submit"
            disabled={!apiKey.trim().length}
            size="M"
            style={{
              marginLeft: layout.spacing_x2,
            }}
            onPress={() => onClose(apiKey.trim())}
          />
        </View>
      </View>
    </ModalBase>
  );
};
