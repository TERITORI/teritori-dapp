import * as React from "react";
import { View, ViewStyle } from "react-native";

import {neutral33} from "../../utils/style/colors"
import { BrandText } from "../BrandText";

export const TertiaryBadge: React.FC<{
		label: string;
		style?: ViewStyle;
}> = ({ label, style }) => {
		return (
				<View
						style={[
								{
										paddingVertical: 5,
										paddingHorizontal: 12,
										backgroundColor: neutral33,
										borderRadius: 999,
										width: "fit-content",
								},
								style,
						]}
				>
						<BrandText style={{ fontSize: 14, color: "#FFFFFF", lineHeight: 16 }}>
								{label}
						</BrandText>
				</View>
		);
};
