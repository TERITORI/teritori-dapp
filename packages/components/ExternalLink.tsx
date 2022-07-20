import React from "react"
import {BrandText} from "./BrandText"
import {primaryColor} from "../utils/colors"
import {TextStyle, TouchableOpacity} from "react-native"
import { Linking } from 'react-native';

export const ExternalLink: React.FC<{
		externalUrl: string
		style?: TextStyle
}> = ({children,externalUrl, style}) => {
		return (
				<TouchableOpacity onPress={() => Linking.openURL( externalUrl )}>
						<BrandText
								style={[{
										// @ts-ignore
										textDecoration: "underline",
										// TODO: color gradient blue
										color: primaryColor
								}, style]}
						>
								<>{children}</>
						</BrandText>
				</TouchableOpacity>
		)
}