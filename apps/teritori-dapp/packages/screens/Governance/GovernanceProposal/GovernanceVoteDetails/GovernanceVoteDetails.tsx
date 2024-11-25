import React from "react";

import { VoteDetailsBox } from "./components/VoteDetailsBox";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { neutral77 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { FinalTallyResult } from "@/utils/types/gov";

export const GovernanceVoteDetails: React.FC<{
  result: FinalTallyResult;
  isVoteEnable: boolean;
}> = ({ result, isVoteEnable }) => {
  return (
    <>
      <BrandText
        style={[
          fontSemibold14,
          {
            color: neutral77,
          },
        ]}
      >
        Vote details
      </BrandText>
      <SpacerColumn size={2} />
      <VoteDetailsBox result={result} isVoteEnable={isVoteEnable} />
    </>
  );
};
