// A clickable "<- Back To xxx" or "<- Back". Choose if navigate() or goBack(). You can handle more action with onPress() prop
import React from "react"
import {RootStackParamList, useAppNavigation} from "../../utils/navigation"
import {Image, TouchableOpacity, View} from "react-native"
import BackSVG from "../../../assets/icons/back.svg"
import {BrandText} from "../BrandText"
import {neutral22} from "../../utils/style/colors"

export const BackTo: React.FC<{
		label?: string;
		navItem?: keyof RootStackParamList;
		onPress?: () => void;
		navParams?: object;
}> = ({ label = "", navItem, onPress, navParams }) => {
		const navigation = useAppNavigation();
		const labelFontSize = 16;

		const handleOnPress = () => {
				if (onPress) onPress();
				if (!navItem) navigation.goBack();
				else if (navItem && navParams) navigation.navigate(navItem, navParams);
				else if (navItem) navigation.navigate(navItem);
		};

		return (
				<TouchableOpacity onPress={handleOnPress}>
						<View
								style={{
										flex: 1,
										flexDirection: "row",
										justifyContent: "center",
										alignItems: "center",
								}}
						>
								<View style={{width: 32,  height: 32, backgroundColor: neutral22, borderRadius: 999}}>
									<BackSVG style={{margin: "auto"}}/>
								</View>
								<BrandText
										style={{
												fontSize: labelFontSize,
												lineHeight: 16,
												letterSpacing: -(labelFontSize * 0.04),
												marginLeft: 12,
										}}
								>
										{label}
								</BrandText>
						</View>
				</TouchableOpacity>
		);
};