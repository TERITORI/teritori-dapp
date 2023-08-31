import React, { useState } from "react";

import { ChallengeDetails } from "./ChallengeDetails/ChallengeDetails";
import { DetailsCard } from "./ChallengeDetails/DetailsCard";
import { Challenge } from "../../api/pathwar/v1/pathwar";
import { neutral17 } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const ChallengeBox: React.FC<{
  data: Challenge;
}> = ({ data }) => {
  const [displayChallengeDetails, setDisplayChallengeDetails] = useState(false);

  return (
    <TertiaryBox
      mainContainerStyle={{ backgroundColor: neutral17 }}
      style={{
        marginBottom: layout.padding_x2_5,
        marginLeft: layout.padding_x1,
        marginRight: layout.padding_x1,
      }}
    >
      <ChallengeDetails
        data={data}
        displayChallengedDetails={displayChallengeDetails}
        setDisplayChallengedDetails={setDisplayChallengeDetails}
      />
      <DetailsCard
        data={data}
        onMoreButtonPress={() => setDisplayChallengeDetails(true)}
      />
    </TertiaryBox>
  );
};
