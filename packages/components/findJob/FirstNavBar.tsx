import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { SecondaryButtonOutline } from "../../components/buttons/SecondaryButtonOutline";
import { white, neutral00 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText/BrandText";
import { CreateBountyMissionPopup } from "./CreateBountyMissionPopup";
import { CreateFreelanceMissionPopup } from "./CreateFreelanceMissionPopup";
import { CreateJobOfferPopup } from "./CreateJobOfferPopup";

export const FirstNavBar: React.FC<object> = () => {
  const [actualItem, setActualItem] = useState("");
  const [displayCreateJobOffer, setDisplayCreateJobOffer] = useState(false);
  const [displayCreateBounty, setDisplayCreateBounty] = useState(false);
  const [displayCreateFreelance, setDisplayCreateFreelance] = useState(false);

  function displayCreateJobOfferPopup() {
    if (displayCreateJobOffer === true) {
      return (
        <CreateJobOfferPopup
          visible
          onClose={() => setDisplayCreateJobOffer(false)}
        />
      );
    } else return null;
  }

  function displayCreateBountyMission() {
    if (displayCreateBounty === true) {
      return (
        <CreateBountyMissionPopup
          visible
          onClose={() => setDisplayCreateBounty(false)}
        />
      );
    } else return null;
  }

  function displayCreateFreelanceMission() {
    if (displayCreateFreelance === true) {
      return (
        <CreateFreelanceMissionPopup
          visible
          onClose={() => setDisplayCreateFreelance(false)}
        />
      );
    } else return null;
  }

  const data = ["Job Offer", "Bountry mission", "Freelance service"];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 50,
      }}
    >
      {displayCreateJobOfferPopup()}
      {displayCreateBountyMission()}
      {displayCreateFreelanceMission()}
      <View style={{ flexDirection: "row" }}>
        {data.map((item, index) => (
          <View
            key={index}
            style={{
              margin: layout.padding_x1,
              marginRight: layout.padding_x2_5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setActualItem(item.toString());
              }}
              key={index}
            >
              <BrandText
                style={[
                  fontSemibold14,
                  {
                    color: white,
                  },
                ]}
              >
                {item}
              </BrandText>
            </TouchableOpacity>

            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: actualItem === item ? white : neutral00,
                borderRadius: 4,
                position: "relative",
                top: 14,
              }}
            />
          </View>
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: 600,
        }}
      >
        <SecondaryButtonOutline
          size="XS"
          text="Create a Freelance Mission"
          onPress={() => setDisplayCreateFreelance(true)}
        />
        <SecondaryButtonOutline
          size="XS"
          text="Create a bounty mission"
          onPress={() => setDisplayCreateBounty(true)}
        />
        <SecondaryButtonOutline
          size="XS"
          text="Create a job offer"
          onPress={() => setDisplayCreateJobOffer(true)}
        />
      </View>
    </View>
  );
};
