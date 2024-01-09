import React from "react";
import { View } from "react-native";

import { EstateCardImageProps } from "./types";
import { OptimizedImage } from "../../../../components/OptimizedImage";
import { SecondaryBox } from "../../../../components/boxes/SecondaryBox";
import { useIsMobile } from "../../../../hooks/useIsMobile";
import { useTheme } from "../../../../hooks/useTheme";

export const EstateCardImage: React.FC<EstateCardImageProps> = ({
  sourceURI,
}) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const imageSize = isMobile ? 150 : 247;

  return (
    <View
      style={{
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "flex-end",
        marginLeft: 10,
      }}
    >
      <SecondaryBox
        style={{
          borderColor: theme.borderColor,
          backgroundColor: theme.backgroundColor,
          width: imageSize,
          height: imageSize,
        }}
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
      </SecondaryBox>
    </View>
  );
};
