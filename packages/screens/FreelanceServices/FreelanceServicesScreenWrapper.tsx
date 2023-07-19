import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useAppNavigation } from "../../utils/navigation";
import {
  primaryColor,
  secondaryColor,
  neutral33,
  primaryTextColor,
} from "../../utils/style/colors";
import { headerHeight } from "../../utils/style/layout";

export const FreelanceServicesScreenWrapper: React.FC<{
  showBuyerSeller?: boolean;
  isBuyer?: boolean;
  showEscrow?: boolean;
}> = ({
  showBuyerSeller = false,
  isBuyer = true,
  showEscrow = false,
  children,
}) => {
  const navigation = useAppNavigation();
  return (
    <ScreenContainer
      fullWidth
      noMargin
      headerChildren={
        <>
          <BrandText>Freelance Service</BrandText>

          {showBuyerSeller && (
            <View
              style={{
                position: "absolute",
                top: -26,
                right: 692,
                height: headerHeight,
                borderColor: neutral33,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                justifyContent: "center",
                paddingHorizontal: 20,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View
                  style={[
                    {
                      borderTopLeftRadius: 8,
                      borderBottomLeftRadius: 8,
                      borderColor: neutral33,
                      borderWidth: 1,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderRightWidth: 0,
                    },
                    isBuyer && styles.select,
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("FreelanceServicesHomeBuyer");
                    }}
                  >
                    <BrandText
                      style={[
                        { paddingHorizontal: 5, fontSize: 14 },
                        isBuyer && styles.select,
                      ]}
                    >
                      I'm a Buyer
                    </BrandText>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    {
                      borderTopRightRadius: 8,
                      borderBottomRightRadius: 8,
                      borderColor: neutral33,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderWidth: 1,
                      borderLeftWidth: 0,
                    },
                    !isBuyer && styles.select,
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("FreelanceServicesHomeSeller");
                    }}
                  >
                    <BrandText
                      style={[
                        { paddingHorizontal: 5, fontSize: 14 },
                        !isBuyer && styles.select,
                      ]}
                    >
                      I'm a Seller
                    </BrandText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {showEscrow && (
            <View
              style={{
                position: "absolute",
                top: -26,
                right: 692,
                height: headerHeight,
                borderColor: neutral33,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                justifyContent: "center",
                paddingHorizontal: 20,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View
                  style={[
                    {
                      borderRadius: 8,
                      borderColor: neutral33,
                      borderWidth: 1,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("FreelanceServicesEscrow", {});
                    }}
                  >
                    <BrandText style={[{ paddingHorizontal: 5, fontSize: 14 }]}>
                      Manage Escrow
                    </BrandText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </>
      }
    >
      {children}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  select: {
    color: primaryTextColor,
    backgroundColor: primaryColor,
  },
  unselect: {
    color: secondaryColor,
  },
});
