import React, { useMemo, useState } from "react";

import { GovernanceValidatorTab } from "./GovernanceValidatorTab";
import { GovernanceValidators } from "./GovernanceValidators";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { primaryColor, secondaryColor } from "@/utils/style/colors";
import { fontSemibold20 } from "@/utils/style/fonts";

const validators = [
  {
    profileImage:
      "https://imgproxy.tools.teritori.com/insecure/width:137/height:137/plain/https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F1650919213006045184%2Fg1W4znp__400x400.jpg",
    name: "Nickname1",
    voting_power: "0.04",
    time: "Nov 17, 2023, 07:53",
    vote: "Yes",
  },
  {
    profileImage:
      "https://imgproxy.tools.teritori.com/insecure/width:137/height:137/plain/https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F1650919213006045184%2Fg1W4znp__400x400.jpg",
    name: "Nickname2",
    voting_power: "0.04",
    time: "Nov 17, 2023, 07:53",
    vote: "No",
  },
  {
    profileImage:
      "https://imgproxy.tools.teritori.com/insecure/width:137/height:137/plain/https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F1650919213006045184%2Fg1W4znp__400x400.jpg",
    name: "Nickname3",
    voting_power: "0.04",
    time: "Nov 17, 2023, 07:53",
    vote: "NoWithVeto",
  },
  {
    profileImage:
      "https://imgproxy.tools.teritori.com/insecure/width:137/height:137/plain/https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F1650919213006045184%2Fg1W4znp__400x400.jpg",
    name: "Nickname4",
    voting_power: "0.04",
    time: "Nov 17, 2023, 07:53",
    vote: "Abstain",
  },
  {
    profileImage:
      "https://imgproxy.tools.teritori.com/insecure/width:137/height:137/plain/https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F1650919213006045184%2Fg1W4znp__400x400.jpg",
    name: "Nickname5",
    voting_power: "0.04",
    time: "Nov 17, 2023, 07:53",
    vote: "Yes",
  },
];

export const GovernanceAllValidators: React.FC<{
  validator: number;
}> = ({ validator = 0 }) => {
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredValidators = useMemo(
    () =>
      selectedTab !== "all"
        ? validators.filter(
            (p) => p.vote.toLowerCase() === selectedTab.toLowerCase(),
          )
        : validators,
    [selectedTab],
  );

  return (
    <>
      <BrandText
        style={[
          fontSemibold20,
          {
            color: secondaryColor,
          },
        ]}
      >
        All Validators{" "}
        <BrandText
          style={[
            fontSemibold20,
            {
              color: primaryColor,
            },
          ]}
        >
          {validator}
        </BrandText>
      </BrandText>

      <SpacerColumn size={2} />
      <GovernanceValidatorTab onChange={(item) => setSelectedTab(item)} />
      <SpacerColumn size={2} />
      <GovernanceValidators validators={filteredValidators} />
      <SpacerColumn size={2} />
    </>
  );
};
