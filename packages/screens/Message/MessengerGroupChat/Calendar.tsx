import React, { useState } from "react";
import { View, TouchableOpacity, Platform } from "react-native";

import chevronLeftSVG from "../../../../assets/icons/chevron-left.svg";
import chevronRightSVG from "../../../../assets/icons/chevron-right.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SpacerRow } from "../../../components/spacer";
import {
  neutral33,
  secondaryColor,
  neutralA3,
  neutral22,
  neutral17,
  neutral55,
  purpleDark,
} from "../../../utils/style/colors";
import { fontMedium10, fontSemibold13 } from "../../../utils/style/fonts";
const CustomCalendar = () => {
  const [selected, setSelected] = useState("");
  console.log("selectedDate", selected);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const weeks = [];
  const monthDays = [];
  const monthStart = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const monthEnd = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const startDate = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth(),
    monthStart.getDate() - monthStart.getDay()
  );

  for (let i = 0; i < 6; i++) {
    weeks.push(
      <View key={i} style={{ flexDirection: "row" }}>
        {[0, 1, 2, 3, 4, 5, 6].map((j) => {
          const day = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate() + i * 7 + j
          );
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

          return (
            <TouchableOpacity
              key={`${day}-${j}`}
              onPress={() => {
                setSelected(
                  `${day.getDate()}-${
                    currentMonth.getMonth() + 1
                  }-${currentMonth.getFullYear()}`
                );
              }}
              style={{
                width: 50,
                height: 50,
                borderBottomLeftRadius:
                  !selected && i === 6 && j === 0 ? 10 : 90,
                borderBottomRightRadius:
                  !selected && i === 6 && j === 6 ? 10 : 90,
                justifyContent: "center",
                alignItems: "center",
                borderRadius:
                  selected ===
                  `${day.getDate()}-${
                    currentMonth.getMonth() + 1
                  }-${currentMonth.getFullYear()}`
                    ? 90
                    : null,
                backgroundColor:
                  selected ===
                  `${day.getDate()}-${
                    currentMonth.getMonth() + 1
                  }-${currentMonth.getFullYear()}`
                    ? purpleDark
                    : isCurrentMonth
                    ? neutral17
                    : neutral17,
              }}
            >
              <BrandText
                style={[
                  fontSemibold13,
                  {
                    color:
                      selected ===
                      `${day.getDate()}-${
                        currentMonth.getMonth() + 1
                      }-${currentMonth.getFullYear()}`
                        ? "#ffffff"
                        : isCurrentMonth
                        ? secondaryColor
                        : neutral55,
                  },
                ]}
              >
                {day.getDate()}
              </BrandText>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: neutral17,
        borderWidth: 1,
        borderTopWidth: 0,
        width: ["android", "ios"].includes(Platform.OS) ? 350 : 400,
        borderBottomRightRadius: 10,
        borderBottomStartRadius: 10,
        borderColor: neutral33,
        alignItems: "center",
      }}
    >
      {/* Calendar Header */}
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          alignItems: "center",
          zIndex: 11,
          top: -40,
          right: ["android", "ios"].includes(Platform.OS) ? 75 : 160,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() - 1,
                  1
                )
              )
            }
          >
            <SVG
              source={chevronLeftSVG}
              width={16}
              height={16}
              color={secondaryColor}
            />
          </TouchableOpacity>
          <SpacerRow size={1} />
          <TouchableOpacity
            onPress={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1,
                  1
                )
              )
            }
          >
            <SVG
              source={chevronRightSVG}
              width={16}
              height={16}
              color={secondaryColor}
            />
          </TouchableOpacity>
        </View>

        <SpacerRow size={1} />

        <TertiaryBox
          // fullWidth
          disabledBorderColor=""
          mainContainerStyle={{
            backgroundColor: neutral22,
            minWidth: ["android", "ios"].includes(Platform.OS) ? 80 : 160,
          }}
          noBrokenCorners
        >
          <BrandText style={[fontSemibold13, { color: secondaryColor }]}>
            {currentMonth.toLocaleString("default", {
              month: "long",
            })}
          </BrandText>
          <BrandText style={[fontMedium10, { color: neutralA3 }]}>
            {currentMonth.toLocaleString("default", {
              year: "numeric",
            })}
          </BrandText>
        </TertiaryBox>
      </View>

      {/* Calendar */}
      <View>{weeks}</View>
    </View>
  );
};

export default CustomCalendar;
