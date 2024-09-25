import React, { FC, useEffect, useMemo, useState } from "react";
import { TextInput, TextStyle, View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { ErrorText } from "@/components/ErrorText";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { Label } from "@/components/inputs/TextInputCustom";
import { SpacerColumn } from "@/components/spacer";
import { DEFAULT_FORM_ERRORS } from "@/utils/errors";
import { neutral22, neutral77, secondaryColor } from "@/utils/style/colors";
import { fontSemibold10, fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const DateTimeInput: FC<{
  label: string;
  sublabel?: React.ReactElement;
  required?: boolean;
  onChange: (timestamp: number) => void;
  timestamp?: number;
  isDirty?: boolean;
}> = ({
  label,
  sublabel,
  onChange,
  isDirty,
  timestamp = 0,
  required = true,
}) => {
  const [hovered, setHovered] = useState(false);
  const reg = new RegExp(`^\\d+$`);
  const defaultDate = timestamp ? new Date(timestamp) : undefined;

  const [day, setDay] = useState(
    !defaultDate
      ? ""
      : defaultDate?.getDate().toString().length < 2
        ? "0" + defaultDate?.getDate().toString()
        : defaultDate?.getDate().toString(),
  );
  const [month, setMonth] = useState(
    !defaultDate
      ? ""
      : (defaultDate?.getMonth() + 1).toString().length < 2
        ? "0" + (defaultDate?.getMonth() + 1).toString()
        : (defaultDate?.getMonth() + 1).toString(),
  );
  const [year, setYear] = useState(defaultDate?.getFullYear().toString() || "");
  const [hours, setHours] = useState(
    !defaultDate
      ? ""
      : defaultDate?.getHours().toString().length < 2
        ? "0" + defaultDate?.getHours().toString()
        : defaultDate?.getHours().toString(),
  );
  const [minutes, setMinutes] = useState(
    !defaultDate
      ? ""
      : defaultDate?.getMinutes().toString().length < 2
        ? "0" + defaultDate?.getMinutes().toString()
        : defaultDate?.getMinutes().toString(),
  );

  const date = useMemo(
    () =>
      new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10),
        parseInt(hours || "00", 10),
        parseInt(minutes || "00", 10),
      ),
    [year, month, day, hours, minutes],
  );

  const error = useMemo(() => {
    if (!isDirty) return;
    if (!day && !month && !year && !hours && !minutes) {
      return DEFAULT_FORM_ERRORS.required;
    }
    if (
      date.toString() === "Invalid Date" ||
      parseInt(year, 10) === 0 ||
      parseInt(month, 10) === 0 ||
      parseInt(day, 10) === 0 ||
      year.length < 4 ||
      parseInt(month, 10) > 12 ||
      parseInt(month, 10) < 1 ||
      parseInt(day, 10) < 1 ||
      parseInt(day, 10) > 31
    ) {
      return DEFAULT_FORM_ERRORS.datetime;
    }
  }, [year, month, day, hours, minutes, date, isDirty]);

  const valueModifier = (text: string) => {
    console.log("text", text);
    if (!text || reg.test(text)) {
      return text;
    }
  };

  useEffect(() => {
    if (error || !date) return;
    onChange(date.getTime());
  }, [date, error, onChange]);

  return (
    <>
      <CustomPressable
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        style={{ width: "100%" }}
      >
        <Label hovered={hovered} isRequired={required}>
          {label}
        </Label>
        {sublabel && sublabel}
        <SpacerColumn size={1.5} />
        <TertiaryBox
          style={[
            {
              backgroundColor: neutral22,
              paddingHorizontal: layout.spacing_x1_5,
              justifyContent: "center",
              height: 40,
            },
            hovered && { borderColor: secondaryColor },
          ]}
        >
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TextInput
              onBlur={(e) => {
                if (!e.nativeEvent.text) return;
                if (e.nativeEvent.text.length < 2)
                  setDay("0" + e.nativeEvent.text);
              }}
              placeholder="DD"
              placeholderTextColor={neutral77}
              style={textInputCStyle}
              onChangeText={(text) =>
                setDay((day) => (!text ? "" : valueModifier(text) || day))
              }
              value={day}
              maxLength={2}
              numberOfLines={1}
            />

            <View>
              <BrandText style={separatorCStyle}> / </BrandText>
            </View>

            <TextInput
              onBlur={(e) => {
                if (!e.nativeEvent.text) return;
                if (e.nativeEvent.text.length < 2)
                  setMonth("0" + e.nativeEvent.text);
              }}
              placeholder="MM"
              placeholderTextColor={neutral77}
              style={textInputCStyle}
              onChangeText={(text) =>
                setMonth((month) => (!text ? "" : valueModifier(text) || month))
              }
              value={month}
              maxLength={2}
              numberOfLines={1}
            />

            <View>
              <BrandText style={separatorCStyle}> / </BrandText>
            </View>

            <TextInput
              placeholder="YYYY"
              placeholderTextColor={neutral77}
              style={[textInputCStyle, { width: 40 }]}
              onChangeText={(text) =>
                setYear((year) => (!text ? "" : valueModifier(text) || year))
              }
              value={year}
              maxLength={4}
              numberOfLines={1}
            />

            <View>
              <BrandText style={separatorCStyle}>{"  |"}</BrandText>
            </View>

            <TextInput
              onBlur={(e) => {
                if (!e.nativeEvent.text) return;
                if (e.nativeEvent.text.length === 1)
                  setHours("0" + e.nativeEvent.text);
              }}
              placeholder="HH"
              placeholderTextColor={neutral77}
              style={[textInputCStyle, { textAlign: "right" }]}
              onChangeText={(text) =>
                setHours((hours) => (!text ? "" : valueModifier(text) || hours))
              }
              value={hours}
              maxLength={2}
              numberOfLines={1}
            />

            <View>
              <BrandText style={separatorCStyle}> : </BrandText>
            </View>
            <TextInput
              onBlur={(e) => {
                if (!e.nativeEvent.text) return;
                if (e.nativeEvent.text.length === 1)
                  setMinutes("0" + e.nativeEvent.text);
              }}
              placeholder="mm"
              placeholderTextColor={neutral77}
              style={[textInputCStyle, { textAlign: "left" }]}
              onChangeText={(text) =>
                setMinutes((minutes) =>
                  !text ? "" : valueModifier(text) || minutes,
                )
              }
              value={minutes}
              maxLength={2}
              numberOfLines={1}
            />

            <BrandText
              style={[
                fontSemibold10,
                {
                  color: neutral77,
                },
              ]}
            >
              {" "}
              (24h){" "}
            </BrandText>
          </View>
        </TertiaryBox>
      </CustomPressable>

      <ErrorText>{error}</ErrorText>
    </>
  );
};

const textInputCStyle: TextStyle = {
  ...fontSemibold14,
  color: secondaryColor,
  width: 28,
  textAlign: "center",
  ...({ outlineStyle: "none" } as TextStyle),
};

const separatorCStyle: TextStyle = {
  ...fontSemibold14,
  color: neutral77,
};
