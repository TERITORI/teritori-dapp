import {FlowCard} from "../../components/FlowCard"

{/*TODO: STEP3*/}


import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import {WalletSelector} from '../../components/WalletSelector'
import {useAppNavigation} from '../../utils/navigation'
import {WalletsManager} from '../../components/WalletsManager'
import {Header} from "../../components/Header"
import {View} from "react-native"
import {Sidebar} from "../../components/Sidebar"
import {NSBIntro} from "../../components/NameServiceBooking/NSBIntro"
import {NSBLanding} from "../../components/NameServiceBooking/NSBLanding"
import {ScreenContainer2} from "../../components/ScreenContainer2"
import {SocialNetworks} from "../../components/SocialNetworks"


export const NSBHomeScreen: React.FC = () => {
		// const navigation = useAppNavigation();

		return (
				<ScreenContainer2 footerChildren={<SocialNetworks/>}>
						<NSBIntro nsbPage="Home"/>
						<NSBLanding/>
				</ScreenContainer2>
		);
};
