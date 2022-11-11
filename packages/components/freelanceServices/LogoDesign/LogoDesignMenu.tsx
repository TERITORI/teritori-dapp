import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Switch } from "react-native-paper";

import chevronUp from "../../../../assets/icons/chevron-up.svg";
import chevronDown from "../../../../assets/icons/freelance-service/chevron-down.svg";
import sort from "../../../../assets/icons/sort.svg";
import { primaryColor, neutral77 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryBox } from "../../boxes/TertiaryBox";
import { BudgetDropDownMenu } from "./DropDownMenu/BudgetDropDownMenu";
import { DeliveryTimeDropDownMenu } from "./DropDownMenu/DeliveryTimeDropDownMenu";
import { LogoOptionsDropDownMenu } from "./DropDownMenu/LogoOptionsDropDownMenu";
import { SellerDetailsDropDownMenu } from "./DropDownMenu/SellerDetailsDropDownMenu";

export const LogoDesignMenu: React.FC = () => {
  const [isLogoOptionsDisplayed, setIsLogoOptionsDisplayed] = useState(false);
  const [isSellerDetailsDisplayed, setIsSellerDetailsDisplayed] =
    useState(false);
  const [isDeliveryTimeDisplayed, setIsDeliveryTimeDisplayed] = useState(false);
  const [isBudgetDisplayed, setIsBudgetDisplayed] = useState(false);
  const [isProServicesEnabled, setIsProServicesEnabled] = useState(false);
  const [isLocalSellersEnabled, setIsLocalSellersEnabled] = useState(false);
  const [isOnlineSellerEnabled, setIsOnlineSellerEnabled] = useState(false);

  return (
    <View
      style={{
        flexDirection: "column",
        marginTop: 60,
        marginBottom: 70,
        alignSelf: "center",
        width: 1290,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <TertiaryBox
            width={160}
            height={50}
            mainContainerStyle={{ borderColor: "white" }}
            style={{ marginRight: 15 }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <SVG source={sort} width={16} height={16} />
              <BrandText style={fontSemibold14}>Logo Options</BrandText>
              <TouchableOpacity
                onPress={() => {
                  setIsLogoOptionsDisplayed(!isLogoOptionsDisplayed);
                  setIsSellerDetailsDisplayed(false);
                  setIsDeliveryTimeDisplayed(false);
                  setIsBudgetDisplayed(false);
                }}
              >
                {isLogoOptionsDisplayed ? (
                  <SVG source={chevronDown} width={16} height={16} />
                ) : (
                  <SVG source={chevronUp} width={16} height={16} />
                )}
              </TouchableOpacity>
            </View>
          </TertiaryBox>

          {isLogoOptionsDisplayed && <LogoOptionsDropDownMenu />}

          <TertiaryBox
            width={160}
            height={50}
            mainContainerStyle={{ borderColor: "white", marginRight: 15 }}
            style={{ marginRight: 15 }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <SVG source={sort} width={16} height={16} />
              <BrandText style={fontSemibold14}>Seller Details</BrandText>
              <TouchableOpacity
                onPress={() => {
                  setIsSellerDetailsDisplayed(!isSellerDetailsDisplayed);
                  setIsLogoOptionsDisplayed(false);
                  setIsDeliveryTimeDisplayed(false);
                  setIsBudgetDisplayed(false);
                }}
              >
                {isSellerDetailsDisplayed ? (
                  <SVG source={chevronDown} width={16} height={16} />
                ) : (
                  <SVG
                    source={chevronUp}
                    width={16}
                    height={16}
                    color="white"
                  />
                )}
              </TouchableOpacity>
            </View>

            {isSellerDetailsDisplayed && <SellerDetailsDropDownMenu />}
          </TertiaryBox>

          <TertiaryBox
            width={120}
            height={50}
            mainContainerStyle={{ borderColor: "white" }}
            style={{ marginRight: 15 }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <SVG source={sort} width={16} height={16} />
              <BrandText style={fontSemibold14}>Budget</BrandText>
              <TouchableOpacity
                onPress={() => {
                  setIsBudgetDisplayed(!isBudgetDisplayed);
                  setIsLogoOptionsDisplayed(false);
                  setIsSellerDetailsDisplayed(false);
                  setIsDeliveryTimeDisplayed(false);
                }}
              >
                {isBudgetDisplayed ? (
                  <SVG source={chevronDown} width={16} height={16} />
                ) : (
                  <SVG source={chevronUp} width={16} height={16} />
                )}
              </TouchableOpacity>
            </View>

            {isBudgetDisplayed && <BudgetDropDownMenu />}
          </TertiaryBox>

          <TertiaryBox
            width={160}
            height={50}
            mainContainerStyle={{ borderColor: "white" }}
            style={{ marginRight: 15 }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <SVG source={sort} width={16} height={16} />
              <BrandText style={fontSemibold14}>Delivery Time</BrandText>
              <TouchableOpacity
                onPress={() => {
                  setIsDeliveryTimeDisplayed(!isDeliveryTimeDisplayed);
                  setIsLogoOptionsDisplayed(false);
                  setIsSellerDetailsDisplayed(false);
                  setIsBudgetDisplayed(false);
                }}
              >
                {isDeliveryTimeDisplayed ? (
                  <SVG source={chevronDown} width={16} height={16} />
                ) : (
                  <SVG source={chevronUp} width={16} height={16} />
                )}
              </TouchableOpacity>
            </View>

            {isDeliveryTimeDisplayed && <DeliveryTimeDropDownMenu />}
          </TertiaryBox>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Switch
              onValueChange={setIsProServicesEnabled}
              value={isProServicesEnabled}
              color={primaryColor}
              style={{ width: 40, height: 24, marginRight: 10 }}
            />
            <BrandText style={fontSemibold14}>Pro Services</BrandText>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Switch
              onValueChange={setIsLocalSellersEnabled}
              value={isLocalSellersEnabled}
              color={primaryColor}
              style={{ width: 40, height: 24, marginRight: 10 }}
            />
            <BrandText style={fontSemibold14}>Local sellers</BrandText>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Switch
              onValueChange={setIsOnlineSellerEnabled}
              value={isOnlineSellerEnabled}
              color={primaryColor}
              style={{ width: 40, height: 24, marginRight: 10 }}
            />
            <BrandText style={fontSemibold14}>Online sellers</BrandText>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginTop: 30,
          width: "100%",
          justifyContent: "space-between",
          zIndex: -1,
        }}
      >
        <BrandText style={[{ color: neutral77 }, fontSemibold16]}>
          241,543 services available
        </BrandText>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BrandText style={[{ color: neutral77 }, fontSemibold16]}>
            Sort by
          </BrandText>
          <BrandText
            style={[fontSemibold16, { marginLeft: 8, marginRight: 8 }]}
          >
            Best Selling
          </BrandText>
          <TouchableOpacity>
            <SVG source={chevronDown} width={16} height={16} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
