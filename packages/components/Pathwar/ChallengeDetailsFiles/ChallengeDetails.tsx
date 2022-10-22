import React, { useState } from "react";
import { View } from "react-native";

import checkIcon from "../../../../assets/icons/Pathwar/checkIcon.svg";
import closeIcon from "../../../../assets/icons/Pathwar/closeIcon.svg";
import { SVG } from "../../../components/SVG";
import { BrandText } from "../../BrandText/BrandText";
import { TertiaryBox } from "../../boxes/TertiaryBox";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { TextInputCustom } from "../../inputs/TextInputCustom";
import ModalBase from "../../modals/ModalBase";
import { ChallengeValidation } from "./ChallengeValidation";
import { DetailsCard } from "./DetailsCard";
import { ModalError } from "./ModalError";
import { ModalValidation } from "./ModalValidation";

export const ChallengeDetails: React.FC<{
  visible?: boolean;
  onClose: () => void;
  title: string;
  description: string;
  tags: string[];
}> = ({ visible, onClose, title, description, tags }) => {
  const [displayChallengedDetails, setDisplayChallengedDetails] =
    useState(visible);
  const [displayStateValidation, setDisplayStateValidation] = useState(false);
  const [displayStateValidationError, setDisplayStateValidationError] =
    useState(false);
  const [displayPassedChallengeScreen, setDisplayPassedChallengeScreen] =
    useState(false);

  function handleConfirmClick() {
    onClose();
    setDisplayChallengedDetails(false);
  }

  function displayChallengeValidation() {
    if (displayPassedChallengeScreen === true) {
      return (
        <ChallengeValidation
          visible
          onClose={() => {
            setDisplayPassedChallengeScreen(false);
            handleConfirmClick();
          }}
        />
      );
    } else return null;
  }

  function ValidationModal() {
    if (displayStateValidation === true) {
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
    if (displayStateValidationError === true) {
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
        width={675}
        hideMainSeparator
      >
        <DetailsCard title={title} description={description} tags={tags} />

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <BrandText style={{ fontSize: 16 }}>Solve Challenge</BrandText>
          <View
            style={{
              backgroundColor: "#171717",
              width: "fit-content",
              borderRadius: 6,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BrandText style={{ fontSize: 12, color: "#777777" }}>
              {"  purchased Today at 5:54 PM  "}
            </BrandText>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#171717",
            borderWidth: 1,
            borderColor: "#333333",
            height: 72,
            borderRadius: 8,
            alignItems: "flex-start",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              marginLeft: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <BrandText style={{ fontSize: 13, marginBottom: 5 }}>
                {"http://iadu7qp6.fr2.pathwar.net  "}
              </BrandText>
              <SVG source={checkIcon} />
              <BrandText
                style={{
                  fontSize: 13,
                  marginBottom: 5,
                  color: "#C8FFAE",
                  marginLeft: 5,
                }}
              >
                {"Available  "}
              </BrandText>
            </View>
            <View style={{ flexDirection: "row" }}>
              <BrandText style={{ fontSize: 13, marginBottom: 5 }}>
                {"http://12rchdcf.local  "}
              </BrandText>
              <SVG source={closeIcon} />
              <BrandText
                style={{
                  fontSize: 13,
                  marginBottom: 5,
                  color: "#EAA54B",
                  marginLeft: 5,
                }}
              >
                {"Available soon...  "}
              </BrandText>
            </View>
          </View>
        </View>

        <SecondaryButton
          size="SM"
          text="Validate"
          width={128}
          style={{ marginBottom: 15 }}
        />

        <TertiaryBox
          width={635}
          height={236}
          mainContainerStyle={{ backgroundColor: "#171717" }}
          style={{ marginBottom: 20 }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              bottom: 5,
            }}
          >
            <View style={{ marginBottom: 15 }}>
              <BrandText
                style={{ fontSize: 14, color: "#777777", marginBottom: 5 }}
              >
                Passphrase
              </BrandText>
              <TextInputCustom<{ Passphrase: string }>
                label=""
                name="Passphrase"
                placeHolder="Passphrases separated by ','"
                width={600}
                squaresBackgroundColor="#171717"
              />
            </View>
            <View style={{ marginBottom: 15 }}>
              <BrandText
                style={{ fontSize: 14, color: "#777777", marginBottom: 5 }}
              >
                Comment
              </BrandText>
              <TextInputCustom<{ Comment: string }>
                label=""
                name="Comment"
                placeHolder="Leave a comment..."
                width={600}
                squaresBackgroundColor="#171717"
              />
            </View>

            <PrimaryButton
              size="SM"
              text="Send"
              width={100}
              squaresBackgroundColor="#171717"
              onPress={() => {
                setDisplayPassedChallengeScreen(true);
              }}
            />
          </View>
        </TertiaryBox>
      </ModalBase>

      {displayChallengeValidation()}
      {ValidationModal()}
      {ErrorModal()}
    </>
  );
};
