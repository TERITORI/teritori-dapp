import React, { useState } from "react";
import { View } from "react-native";

import { ChallengeValidation } from "./ChallengeValidation";
import { ModalValidation } from "./ModalValidation";
import { Challenge } from "../../../../api/pathwar/v1/pathwar";
import { useSelectedNetworkId } from "../../../../hooks/useSelectedNetwork";
import { mustGetPathwarClient } from "../../../../utils/backend";
import { neutral17, neutral77 } from "../../../../utils/style/colors";
import { fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { BrandText } from "../../../BrandText";
import { TertiaryBox } from "../../../boxes/TertiaryBox";
import { PrimaryButton } from "../../../buttons/PrimaryButton";
import { TextInputCustom } from "../../../inputs/TextInputCustom";
import { ModalError } from "../ModalError";

export const ValidateForm: React.FC<{ data: Challenge }> = ({ data }) => {
  const [displayStateValidation, setDisplayStateValidation] = useState(false);
  const [displayStateValidationError, setDisplayStateValidationError] =
    useState(false);
  const [displayPassedChallengeScreen, setDisplayPassedChallengeScreen] =
    useState(false);
  const [answer, setAnswer] = useState("");

  const selectedNetworkId = useSelectedNetworkId();

  const handleSend = async () => {
    try {
      const res = await mustGetPathwarClient(
        selectedNetworkId
      ).ChallengeValidate({
        id: 1,
        networkId: selectedNetworkId,
        passphrase: answer,
      });

      console.log(res);
      // setDisplayPassedChallengeScreen(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TertiaryBox
      height={236}
      mainContainerStyle={{ backgroundColor: neutral17 }}
      style={{ marginBottom: layout.padding_x2_5, alignSelf: "center" }}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          paddingLeft: layout.padding_x3_5,
          paddingRight: layout.padding_x3_5,
        }}
      >
        <View style={{ marginBottom: layout.padding_x2 }}>
          <BrandText
            style={[
              { color: neutral77, marginBottom: layout.padding_x0_5 },
              fontSemibold14,
            ]}
          >
            Passphrase
          </BrandText>
          <TextInputCustom<{ Passphrase: string }>
            label=""
            onChangeText={setAnswer}
            value={answer}
            name="Passphrase"
            placeHolder="Passphrases separated by ','"
            width={600}
            squaresBackgroundColor={neutral17}
          />
        </View>
        <View style={{ marginBottom: layout.padding_x2 }}>
          <BrandText
            style={[
              { color: neutral77, marginBottom: layout.padding_x0_5 },
              fontSemibold14,
            ]}
          >
            Comment
          </BrandText>
          <TextInputCustom<{ Comment: string }>
            label=""
            name="Comment"
            placeHolder="Leave a comment..."
            width={600}
            squaresBackgroundColor={neutral17}
          />
        </View>

        <PrimaryButton
          size="SM"
          text="Send"
          width={100}
          squaresBackgroundColor={neutral17}
          onPress={() => {
            handleSend();
          }}
        />
      </View>
      {displayPassedChallengeScreen && (
        <ChallengeValidation
          visible
          onClose={() => {
            setDisplayPassedChallengeScreen(false);
          }}
          data={data}
        />
      )}

      {displayStateValidation && (
        <ModalValidation
          visible
          onClose={() => {
            setDisplayStateValidation(false);
            setDisplayPassedChallengeScreen(true);
          }}
        />
      )}

      {displayStateValidationError && (
        <ModalError
          visible
          onClose={() => {
            setDisplayStateValidationError(false);
          }}
        />
      )}
    </TertiaryBox>
  );
};
