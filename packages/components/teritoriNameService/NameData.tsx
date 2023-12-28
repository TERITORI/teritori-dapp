import React from "react";
import { View, ViewStyle } from "react-native";

import { neutral77 } from "../../utils/style/colors";
import { imageDisplayLabel, prettyTokenData } from "../../utils/teritori";
import { BrandText } from "../BrandText";
import { ExternalLink } from "../ExternalLink";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const NameData: React.FC<{
  token: any;
  name: string;
  style?: ViewStyle;
}> = ({ token, name, style }) => {
  const width = 396;

  return (
    <TertiaryBox
      style={{
        ...{ width },
        ...[style],
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingHorizontal: 24,
        paddingVertical: 24,
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
                  {data.displayLabel === imageDisplayLabel ? (
                    <ExternalLink
                      gradientType="blue"
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
