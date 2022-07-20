import bookPNG from "../../assets/icons/book.png"

{/*TODO: STEP3*/}

import React from "react";
import {
		Image,
		ImageSourcePropType, ImageStyle, TouchableOpacity,
		View, ViewStyle
} from "react-native"

import {footerHeight} from "../utils/layout"
import mediumPNG from "../../assets/icons/medium.png"
import twitterPNG from "../../assets/icons/twitter.png"
import discordPNG from "../../assets/icons/discord.png"
import backPNG from "../../assets/icons/back.png"
import {BrandText} from "./BrandText"
import {RootStackParamList, useAppNavigation} from "../utils/navigation"

// One social network button
const NetworkButton: React.FC<{
		iconSource: ImageSourcePropType;
		style?: ViewStyle;
		imageStyle?: ImageStyle;
		onPress?: () => void;
}> = ({iconSource, onPress, style, imageStyle}) => {
		return (
				<TouchableOpacity
						style={[{
								height: 32, width: 32,
								borderColor: "#1B1E1F", borderRadius: 5, borderWidth: 1, borderStyle: "solid"
						}, style]}
						onPress={onPress}
				>
						<Image source={iconSource} style={[{margin: "auto", width: 12, height: 12, resizeMode: "stretch"}, imageStyle]}/>
				</TouchableOpacity>
		)
}

// All social network buttons
export const SocialNetworks: React.FC = () => {
		return (
				<View
						style={{
								flex: 1,
								flexDirection: "row", justifyContent: "center", alignItems: "center"
						}}
				>
						<NetworkButton iconSource={bookPNG} style={{marginRight: 16}} imageStyle={{ width: 15, height: 15}}/>
						<NetworkButton iconSource={mediumPNG} style={{marginRight: 16}}/>
						<NetworkButton iconSource={twitterPNG} style={{marginRight: 16}}/>
						<NetworkButton iconSource={discordPNG} imageStyle={{width: 15}}/>
				</View>
		)
}

// A clickable "<- Back To xxx" or "<- Back". Choose if navigate() or goBack()
export const BacKTo: React.FC<{
		label?: string;
		navItem?: keyof RootStackParamList;
		justBack?: boolean
}> = ({label, navItem, justBack}) => {
		const navigation = useAppNavigation()
		const labelFontSize = 16

		return (
				<TouchableOpacity onPress={justBack ? () => navigation.goBack() : () => navigation.navigate(navItem)}>
						<View
								style={{
										flex: 1,
										flexDirection: "row", justifyContent: "center", alignItems: "center"
								}}
						>
								<Image source={backPNG} style={{width: 24, height: 24}}/>
								<BrandText
										style={{fontSize: labelFontSize, lineHeight: 16, letterSpacing: -(labelFontSize * 0.04), marginLeft: 8}}
								>
										{label ? `Back to ${label}` : "Back"}
								</BrandText>

						</View>
				</TouchableOpacity>
		);
};

// A footer that can contains children
{/*TODO: Is it a good name for this cpt ?*/}
export const Footer: React.FC = ({children}) => {
		return (
				<View
						style={{
								height: footerHeight, maxHeight: footerHeight,
								width: "100%",
								flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center"
						}}
				>
						<>{children}</>
				</View>
		);
};
