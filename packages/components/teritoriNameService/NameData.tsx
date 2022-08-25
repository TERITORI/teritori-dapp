import React from "react";
import { View } from "react-native";

import { neutral77 } from "../../utils/style/colors";
import {
  imageDisplayLabel,
  prettyTokenData,
  publicNameDisplayLabel,
} from "../../utils/teritori";
import { BrandText } from "../BrandText";
import { ExternalLink } from "../ExternalLink";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { NameAndTldText } from "./NameAndTldText";

export const NameData: React.FC<{
  token: any;
  name: string;
}> = ({ token, name }) => {
  const width = 396;

  return (
    <TertiaryBox
      nonPressable
      width={width}
      paddingHorizontal={24}
      paddingVertical={24}
      mainContainerStyle={{
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      {token ? (
        <>
          <View style={{ flex: 1, marginBottom: 32 }}>
            <BrandText
              style={{
                fontSize: 16,
                marginBottom: 8,
                color: neutral77,
              }}
            >
              Name
            </BrandText>
            <BrandText style={{ letterSpacing: -(20 * 0.04) }}>
              {name}
            </BrandText>
          </View>

          <View style={{ width: "100%" }}>
            {prettyTokenData(token)
              // We display only the raw if there is a value
              .filter((data) => data.value)
              .map((data, i) => (
                <View style={{ marginBottom: 32 }} key={i}>
                  <BrandText
                    style={{
                      fontSize: 16,
                      marginBottom: 8,
                      color: neutral77,
                    }}
                  >
                    {data.displayLabel}
                  </BrandText>
                  {/*---- We want some style depending on the data type*/}
                  {data.displayLabel === publicNameDisplayLabel ? (
                    <NameAndTldText nameAndTldStr={data.value} />
                  ) : data.displayLabel === imageDisplayLabel ? (
                    // TODO: Gradient text blue-green
                    <ExternalLink
                      externalUrl={data.value}
                      style={{ letterSpacing: -(20 * 0.04) }}
                      numberOfLines={1}
                    >
                      {data.value}
                    </ExternalLink>
                  ) : (
                    <BrandText style={{ letterSpacing: -(20 * 0.04) }}>
                      {data.value}
                    </BrandText>
                  )}
                </View>
              ))}
          </View>
        </>
      ) : (
        <BrandText>Loading</BrandText>
      )}
    </TertiaryBox>
  );
};
