import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { DropdownButton } from "../../components/buttons/DropdownButton";
import { TextInputSearch } from "../../components/inputs/TextInputSearch";
import {
  neutral44,
  primaryTextColor,
  neutral77,
  white,
  neutral00,
} from "../../utils/style/colors";
import { fontMedium10, fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText/BrandText";

export const SecondNavBar: React.FC<object> = () => {
  const [actualItem, setActualItem] = useState("");
  const [isMoreDisplayed, setIsMoreDisplayed] = useState(false);

  const data = [
    "Engineering",
    "Product",
    "Marketing",
    "Operations",
    "Creative",
    "Others",
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 30,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            margin: 10,
            marginRight: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setActualItem("All");
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BrandText
                style={[
                  fontSemibold14,
                  {
                    color: white,
                  },
                ]}
              >
                All
              </BrandText>
              <View
                style={{
                  backgroundColor: actualItem === "All" ? white : neutral77,
                  borderRadius: 24,
                  marginLeft: 5,
                }}
              >
                <BrandText
                  style={[
                    fontSemibold14,
                    {
                      color: actualItem === "All" ? primaryTextColor : white,
                      paddingLeft: 7,
                      paddingRight: 7,
                      paddingTop: 2,
                      paddingBottom: 2,
                    },
                  ]}
                >
                  27 Jobs
                </BrandText>
              </View>
            </View>
          </TouchableOpacity>

          <View
            style={{
              width: "100%",
              height: 1,
              backgroundColor: actualItem === "All" ? white : neutral00,
              borderRadius: 4,
              position: "relative",
              top: 14,
            }}
          />
        </View>
        {data.map((item, index) => (
          <View
            key={index}
            style={{
              margin: 10,
              marginRight: 20,
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
                top: 16,
              }}
            />
          </View>
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 50,
        }}
      >
        <View
          style={{
            marginRight: 17,
            width: 250,
          }}
        >
          <TextInputSearch<{ "": string }>
            name=""
            label=""
            placeHolder="Search..."
          />
        </View>
        <View style={{ flexDirection: "column", justifyContent: "flex-end" }}>
          <DropdownButton
            size="SM"
            textCompressed="    Filter"
            textExpanded="    Filter"
            onPress={() => setIsMoreDisplayed(!isMoreDisplayed)}
            isExpanded={isMoreDisplayed}
          />
        </View>
      </View>
      {isMoreDisplayed && (
        <View
          style={{
            backgroundColor: neutral44,
            width: 150,
            height: 230,
            borderRadius: 8,
            marginTop: 60,
            left: "86.5%",
            position: "absolute",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "flex-start",
              marginLeft: 10,
              marginTop: 15,
            }}
          >
            <BrandText
              style={[
                fontMedium10,
                {
                  color: white,
                },
              ]}
            >
              Location
            </BrandText>
            <TouchableOpacity>
              <BrandText
                style={[
                  fontSemibold14,
                  {
                    marginBottom: 5,
                  },
                ]}
              >
                Paris, France
              </BrandText>
            </TouchableOpacity>
            <TouchableOpacity>
              <BrandText
                style={[
                  fontSemibold14,
                  {
                    marginBottom: 5,
                  },
                ]}
              >
                Germany, Berlin
              </BrandText>
            </TouchableOpacity>
            <TouchableOpacity>
              <BrandText
                style={[
                  fontSemibold14,
                  {
                    marginBottom: 5,
                  },
                ]}
              >
                Italy, Rome
              </BrandText>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "flex-start",
              marginLeft: 10,
              marginTop: 20,
            }}
          >
            <BrandText
              style={[
                fontMedium10,
                {
                  marginBottom: 7,
                  color: neutral77,
                },
              ]}
            >
              Basis
            </BrandText>
            <TouchableOpacity>
              <BrandText
                style={[
                  fontSemibold14,
                  {
                    marginBottom: 5,
                  },
                ]}
              >
                Full time
              </BrandText>
            </TouchableOpacity>
            <TouchableOpacity>
              <BrandText
                style={[
                  fontSemibold14,
                  {
                    marginBottom: 5,
                  },
                ]}
              >
                Part time
              </BrandText>
            </TouchableOpacity>
            <TouchableOpacity>
              <BrandText
                style={[
                  fontSemibold14,
                  {
                    marginBottom: 5,
                  },
                ]}
              >
                Per project
              </BrandText>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
