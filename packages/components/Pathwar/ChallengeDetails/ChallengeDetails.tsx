import React from "react";
import { View } from "react-native";

import { SolveChallenge } from "./ChallengeValidation/SolveChallenge";
import { DetailsCard } from "./DetailsCard";
import { Challenge } from "../../../api/pathwar/v1/pathwar";
import { ModalBase } from "../../modals/ModalBase";

export const ChallengeDetails: React.FC<{
  displayChallengedDetails: boolean;
  setDisplayChallengedDetails: (value: boolean) => void;
  data: Challenge;
}> = ({ displayChallengedDetails, setDisplayChallengedDetails, data }) => {
  function handleConfirmClick() {
    setDisplayChallengedDetails(false);
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
        <View style={{ alignSelf: "center" }}>
          <DetailsCard data={data} />
        </View>
        <SolveChallenge data={data} />
      </ModalBase>
    </>
  );
};
