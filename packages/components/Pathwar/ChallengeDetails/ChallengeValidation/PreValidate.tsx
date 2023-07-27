import React from "react";
import { View } from "react-native";

import checkIcon from "../../../../../assets/icons/pathwar/checkIcon.svg";
import closeIcon from "../../../../../assets/icons/pathwar/closeIcon.svg";
import { Challenge } from "../../../../api/pathwar/v1/pathwar";
import {
  availableSoonColor,
  errorColor,
  neutral17,
  neutral33,
  neutral77,
  successColor,
} from "../../../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold16,
} from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { BrandText } from "../../../BrandText";
import { SVG } from "../../../SVG";
import { SecondaryButton } from "../../../buttons/SecondaryButton";

export const PreValidate: React.FC<{
  setShowForm: (value: boolean) => void;
  showForm: boolean;
  data: Challenge;
}> = ({ setShowForm, data, showForm }) => (
  <>
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
          marginHorizontal: layout.padding_x1_5,
          width: "95%",
        }}
      >
        {data.endpoints.map((endpoint, index) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <BrandText
              style={[
                {
                  marginBottom: layout.padding_x0_5,
                  paddingRight: layout.padding_x1,
                },
                fontSemibold13,
              ]}
            >
              {endpoint.url}
            </BrandText>
            <View style={{ flexDirection: "row", flexWrap: "nowrap" }}>
              <SVG
                source={endpoint.status === "available" ? checkIcon : closeIcon}
              />
              <BrandText
                style={[
                  {
                    marginBottom: layout.padding_x0_5,
                    color:
                      endpoint.status === "available"
                        ? successColor
                        : endpoint.status.includes("soon")
                        ? availableSoonColor
                        : errorColor,
                    marginLeft: layout.padding_x0_5,
                    paddingRight: layout.padding_x1,
                    textTransform: "capitalize",
                  },
                  fontSemibold13,
                ]}
              >
                {endpoint.status}
              </BrandText>
            </View>
          </View>
        ))}
      </View>
    </View>
    {!showForm && (
      <SecondaryButton
        size="SM"
        text="Validate"
        width={128}
        style={{ marginBottom: layout.padding_x2 }}
        onPress={() => setShowForm(true)}
      />
    )}
  </>
);
