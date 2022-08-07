import React from "react";
import { View, ViewStyle } from "react-native";

import { BrandText } from "./BrandText";
import { Logo } from "./svgs/Logo";
// import { LinearGradient } from 'expo-linear-gradient';

export const IntroLogoText: React.FC<{
  subTitle: string;
  style?: ViewStyle;
}> = ({ subTitle, style }) => {
  const height = 273;
  const subTitleFontSize = 16;
  const logoWrapperSize = 200;

  return (
    <View
      style={[
        style,
        {
          flex: 1,
          alignItems: "center",
          maxHeight: height,
          minHeight: height,
          height,
        },
      ]}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          height: logoWrapperSize,
          width: logoWrapperSize,
          marginBottom: 12,
        }}
      >
        <Logo />
      </View>

      {/*========= TEST GRADIENT TEXT*/}

      {/*<BrandText*/}
      {/*		style={{*/}
      {/*				fontSize: titleFontSize,*/}
      {/*				lineHeight: 32,*/}
      {/*				letterSpacing: -(titleFontSize * 0.04)*/}
      {/*		}}*/}
      {/*>*/}
      {/*		TERITORI*/}
      {/*</BrandText>*/}

      {/*<MaskedView*/}
      {/*		style={{height: 24}}*/}
      {/*		maskElement={*/}
      {/*				<BrandText*/}
      {/*						style={{*/}
      {/*								fontSize: titleFontSize,*/}
      {/*								lineHeight: 32,*/}
      {/*								letterSpacing: -(titleFontSize * 0.04)*/}
      {/*						}}*/}
      {/*				>*/}
      {/*						TERITORI*/}
      {/*				</BrandText>*/}
      {/*		}*/}
      {/*>*/}
      {/*		<LinearGradient*/}
      {/*				colors={["#2AF598", "#009EFD"]}*/}
      {/*				start={{x: 1, y: 1}}*/}
      {/*				end={{x: 0, y: 0.33}}*/}
      {/*				style={{flex: 1}}*/}
      {/*		/>*/}
      {/*</MaskedView>*/}

      {/*========= ============*/}

      <BrandText
        style={{
          fontSize: 28,
          lineHeight: 32,
          marginBottom: 8,
        }}
      >
        TERITORI
      </BrandText>

      {/*<BrandText*/}
      {/*		style={{fontWeight: "700", fontSize: subTitleFontSize, lineHeight: 21, letterSpacing: -(titleFontSize * 0.01)}}>*/}
      {/*		{subTitle}*/}
      {/*</BrandText>*/}

      {/*<MaskedView*/}
      {/*		style={{height: 24}}*/}
      {/*		maskElement={*/}
      {/*				<BrandText*/}
      {/*						style={{*/}
      {/*								fontWeight: "700",*/}
      {/*								fontSize: subTitleFontSize,*/}
      {/*								lineHeight: 21,*/}
      {/*								letterSpacing: -(titleFontSize * 0.01),*/}
      {/*								textTransform: "uppercase"*/}
      {/*				}}*/}
      {/*				>*/}
      {/*						{subTitle}*/}
      {/*				</BrandText>*/}
      {/*		}*/}
      {/*>*/}
      {/*		<LinearGradient*/}
      {/*				colors={["#2AF598", "#009EFD"]}*/}
      {/*				start={{x: 1, y: 1}}*/}
      {/*				end={{x: 0, y: 0.33}}*/}
      {/*				style={{flex: 1}}*/}
      {/*		/>*/}
      {/*</MaskedView>*/}

      <BrandText
        style={{
          fontWeight: "700",
          fontSize: subTitleFontSize,
          lineHeight: 21,
          textTransform: "uppercase",
        }}
      >
        {subTitle}
      </BrandText>
    </View>
  );
};
