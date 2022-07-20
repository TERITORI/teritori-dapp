import {ScreenContainer2} from "../../components/ScreenContainer2"

{/*TODO: STEP3 Can edit if the current user is owner and the name is minted. Can create if the name is available*/}

import React, {useContext, useEffect} from "react"

import {View} from "react-native"
import {BacKTo} from "../../components/Footer"
import {NameDataForm} from "../../components/NameServiceBooking/NameDataForm"

// Can edit if the current user is owner and the name is minted. Can create if the name is available
export const NSBEditCreateNameScreen: React.FC = () => {


		return (
				<ScreenContainer2 footerChildren={<BacKTo label="search" navItem="NSBRegister"/>}>
						{/*<View style={{flex: 1, flexDirection: "row", justifyContent: "center"}}>*/}

						{/*</View>*/}
				</ScreenContainer2>
		);
};
