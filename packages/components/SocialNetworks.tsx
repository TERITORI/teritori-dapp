import bookPNG from "../../assets/icons/book.png"
import mediumPNG from "../../assets/icons/medium.png"
import twitterPNG from "../../assets/icons/twitter.png"
import discordPNG from "../../assets/icons/discord.png"

{/*TODO: STEP3*/
}

import React from "react"
import {
		View,
		Image,
		ImageSourcePropType,
		TouchableOpacity, ViewStyle, ImageStyle
} from "react-native"
import {headerHeight} from "../utils/layout"

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
