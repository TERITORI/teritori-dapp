import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { OptimizedImage } from "../../../../components/OptimizedImage";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { selectIsLightTheme } from "../../../../store/slices/settings";

type EstateCardImageProps = {
  sourceURI: string;
};

export const EstateCardImage: React.FC<EstateCardImageProps> = ({
  sourceURI,
}) => {
  const isLightTheme = useSelector(selectIsLightTheme);
  const imageSize = 247;

  return (
    <View style={{ flex: 1, alignItems: "flex-end", marginLeft: 10 }}>
      <TertiaryBox
        mainContainerStyle={{
          borderColor: isLightTheme ? "#FFFFFF" : "#000000",
          backgroundColor: isLightTheme ? "#FFFFFF" : "#000000",
        }}
        squaresBackgroundColor={isLightTheme ? "#FFFFFF" : "#000000"}
        height={imageSize}
        width={imageSize}
      >
        <OptimizedImage
          width={imageSize}
          height={imageSize}
          sourceURI={sourceURI}
          style={{
            height: imageSize - 2,
            width: imageSize - 2,
            borderRadius: 10,
          }}
        />
      </TertiaryBox>
    </View>
  );
};
