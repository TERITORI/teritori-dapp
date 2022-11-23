import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import chatSVG from "../../../assets/icons/organization/chat.svg";
import freelanceSVG from "../../../assets/icons/organization/freelance.svg";
import launchSVG from "../../../assets/icons/organization/launch.svg";
import multisigWalletSVG from "../../../assets/icons/organization/multisig-wallet.svg";
import pathwarSVG from "../../../assets/icons/organization/pathwar.svg";
import postJobSVG from "../../../assets/icons/organization/post-job.svg";
import profileSVG from "../../../assets/icons/organization/profile.svg";
import searchSVG from "../../../assets/icons/organization/search.svg";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SpacerColumn } from "../../components/spacer";
import { useAppNavigation } from "../../utils/navigation";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { GetStartedOption } from "./components/GetStartedOption";

export const OrganizationGetStartedScreen = () => {
  // variables
  const navigation = useAppNavigation();

  // functions
  const onPress = () => {
    alert("TODO");
  };

  // returns
  return (
    <ScreenContainer
      headerChildren={<BrandText>Organization Name</BrandText>}
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
      isHeaderSmallMargin
    >
      <ScrollView>
        <View style={styles.container}>
          <BrandText style={fontSemibold28}>What do you want to do?</BrandText>
          <SpacerColumn size={3} />
          <View style={styles.row}>
            <GetStartedOption
              title="Manage Public Profile"
              icon={profileSVG}
              onPress={onPress}
            />
            <GetStartedOption
              title="Create your first Post"
              icon={searchSVG}
              onPress={onPress}
            />
            <GetStartedOption
              title="Launch an NFT Collection"
              icon={launchSVG}
              onPress={onPress}
            />
            <GetStartedOption
              title="Create the Organization Chat"
              icon={chatSVG}
            />
            <GetStartedOption title="Post Job" icon={postJobSVG} />
            <GetStartedOption
              title="Create Challenge on Pathwar"
              icon={pathwarSVG}
            />
            <GetStartedOption
              title="Create Freelance Service"
              icon={freelanceSVG}
              onPress={onPress}
            />
            <GetStartedOption
              title="Manage Multisig Wallet"
              icon={multisigWalletSVG}
              onPress={() => navigation.navigate("MultisigWalletManage")}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: layout.contentPadding,
    paddingTop: layout.topContentPaddingWithHeading,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -layout.padding_x2,
    marginVertical: -layout.padding_x2,
  },
});
