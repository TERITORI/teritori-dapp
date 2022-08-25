import React from "react";
import { Image } from "react-native";

import guardianPNG from "../../assets/default-images/guardian_1.png";
import { PrimaryBox } from "./boxes/PrimaryBox";

export const Guardian: React.FC = () => (
  <PrimaryBox
    width={204}
    height={280}
    mainContainerStyle={{ overflow: "hidden" }}
  >
    <Image source={guardianPNG} style={{ height: 280, aspectRatio: 1 }} />
  </PrimaryBox>
);
