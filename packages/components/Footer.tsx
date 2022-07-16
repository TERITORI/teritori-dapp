
{/*TODO: STEP3*/}

import React from "react";
import {
		View,
} from "react-native";

import {footerHeight} from "../utils/layout"


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
