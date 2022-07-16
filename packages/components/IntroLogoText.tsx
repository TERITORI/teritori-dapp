import React from "react"

import {View, ViewStyle} from "react-native"
import {Logo} from "./svgs/Logo"
import {BrandText} from "./BrandText"
// import { LinearGradient } from 'expo-linear-gradient';

export const IntroLogoText: React.FC<{
		subTitle: string;
		style?: ViewStyle;
}> = ({subTitle, style}) => {

		const titleFontSize = 28
		const subTitleFontSize = 16
		const logoWrapperSize = 200

		return (
				<View
						style={[style, {
								flex: 1,
								flexDirection: "column",
								alignItems: "center",
						}]}
				>
						<View
								style={{
										flex: 1, alignItems: "center", justifyContent: "center",
										height: logoWrapperSize, width: logoWrapperSize,
										marginBottom: 12
								}}
						>
							<Logo/>
						</View>

						{/*TODO: How to deal with electron cpt ?*/}
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


						<BrandText
								style={{
										fontSize: titleFontSize, lineHeight: 32,	letterSpacing: -(titleFontSize * 0.04),
										marginBottom: 8
								}}
						>
								TERITORI
						</BrandText>


						{/*/!*TODO: Have to set lineHeight and letterSpacing ? Are there auto values ?*!/*/}
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
										letterSpacing: -(titleFontSize * 0.01),
										textTransform: "uppercase"
								}}
						>
								{subTitle}
						</BrandText>

				</View>
		)
}
