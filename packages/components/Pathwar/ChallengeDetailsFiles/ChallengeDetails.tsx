import React, { useState } from "react";
import { ScrollView, View } from "react-native";

import { ChallengeValidation } from "./ChallengeValidation";
import { DetailsCard } from "./DetailsCard";
import { ModalError } from "./ModalError";
import { ModalValidation } from "./ModalValidation";
import checkIcon from "../../../../assets/icons/Pathwar/checkIcon.svg";
import closeIcon from "../../../../assets/icons/Pathwar/closeIcon.svg";
import { Challenge } from "../../../api/pathwar/v1/pathwar";
import {
  availableSoonColor,
  neutral17,
  neutral33,
  neutral77,
  successColor,
} from "../../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryBox } from "../../boxes/TertiaryBox";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { TextInputCustom } from "../../inputs/TextInputCustom";
import { ModalBase } from "../../modals/ModalBase";

export const ChallengeDetails: React.FC<{
  visible?: boolean;
  onClose: () => void;
  data: Challenge;
}> = ({ visible, onClose, data }) => {
  const [displayChallengedDetails, setDisplayChallengedDetails] =
    useState(visible);
  const [displayStateValidation, setDisplayStateValidation] = useState(false);
  const [displayStateValidationError, setDisplayStateValidationError] =
    useState(true);
  const [displayPassedChallengeScreen, setDisplayPassedChallengeScreen] =
    useState(false);

  function handleConfirmClick() {
    onClose();
    setDisplayChallengedDetails(false);
  }

  function displayChallengeValidation() {
    if (displayPassedChallengeScreen) {
      return (
        <ChallengeValidation
          visible
          onClose={() => {
            setDisplayPassedChallengeScreen(false);
            handleConfirmClick();
          }}
          data={data}
        />
      );
    } else return null;
  }

  function ValidationModal() {
    if (displayStateValidation) {
      return (
        <ModalValidation
          visible
          onClose={() => {
            setDisplayStateValidation(false);
            setDisplayPassedChallengeScreen(true);
          }}
        />
      );
    } else return null;
  }

  function ErrorModal() {
    if (displayStateValidationError) {
      return (
        <ModalError
          visible
          onClose={() => {
            setDisplayStateValidationError(false);
          }}
        />
      );
    } else return null;
  }

  return (
    <>
      <ModalBase
        onClose={() => {
          handleConfirmClick();
        }}
        label="Challenge"
        visible={displayChallengedDetails}
        hideMainSeparator
      >
        <ScrollView style={{ height: 790 }}>
          <View style={{ alignSelf: "center" }}>
            <DetailsCard data={data} />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: layout.padding_x1,
            }}
          >
            <BrandText style={fontSemibold16}>Solve Challenge</BrandText>
            <View
              style={{
                backgroundColor: neutral17,
                width: "fit-content",
                borderRadius: 6,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BrandText
                style={[
                  {
                    color: neutral77,
                    paddingLeft: layout.padding_x1,
                    paddingRight: layout.padding_x1,
                  },
                  fontSemibold12,
                ]}
              >
                purchased Today at 5:54 PM
              </BrandText>
            </View>
          </View>

          <View
            style={{
              backgroundColor: neutral17,
              borderWidth: 1,
              borderColor: neutral33,
              height: 72,
              borderRadius: 8,
              alignItems: "flex-start",
              justifyContent: "center",
              marginBottom: layout.padding_x2_5,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-around",
                marginLeft: layout.padding_x1_5,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <BrandText
                  style={[
                    {
                      marginBottom: layout.padding_x0_5,
                      paddingRight: layout.padding_x1,
                    },
                    fontSemibold13,
                  ]}
                >
                  http://iadu7qp6.fr2.pathwar.net
                </BrandText>
                <SVG source={checkIcon} />
                <BrandText
                  style={[
                    {
                      marginBottom: layout.padding_x0_5,
                      color: successColor,
                      marginLeft: layout.padding_x0_5,
                      paddingRight: layout.padding_x1,
                    },
                    fontSemibold13,
                  ]}
                >
                  Available
                </BrandText>
              </View>
              <View style={{ flexDirection: "row" }}>
                <BrandText
                  style={[
                    {
                      marginBottom: layout.padding_x0_5,
                      paddingRight: layout.padding_x1,
                    },
                    fontSemibold13,
                  ]}
                >
                  http://12rchdcf.local
                </BrandText>
                <SVG source={closeIcon} />
                <BrandText
                  style={[
                    {
                      marginBottom: layout.padding_x0_5,
                      color: availableSoonColor,
                      marginLeft: layout.padding_x0_5,
                      paddingRight: layout.padding_x1,
                    },
                    fontSemibold13,
                  ]}
                >
                  Available soon...
                </BrandText>
              </View>
            </View>
          </View>

          <SecondaryButton
            size="SM"
            text="Validate"
            width={128}
            style={{ marginBottom: layout.padding_x2 }}
          />

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
                  setDisplayPassedChallengeScreen(true);
                }}
              />
            </View>
          </TertiaryBox>
        </ScrollView>
      </ModalBase>

      {displayChallengeValidation()}
      {ValidationModal()}
      {ErrorModal()}
    </>
  );
};
