import {UserNameInline} from "../UserNameInline";
import {StyleSheet, TouchableOpacity} from "react-native";
import {layout} from "../../utils/style/layout";
import {purpleLight} from "../../utils/style/colors";
import {fontSemibold14} from "../../utils/style/fonts";
import {BrandText} from "../BrandText";
import {SVG} from "../SVG";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg"
import FlexRow from "../containers/FlexRow";
import FlexCol from "../containers/FlexCol";
import {useAppNavigation} from "../../utils/navigation";
import {CustomPressable} from "../buttons/CustomPressable";

export const Account: React.FC = () => {
  const navigation = useAppNavigation();

  return (
    <FlexCol style={styles.container}>
      <UserNameInline userId={"tori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h"} style={styles.userImageLine}/>

      <FlexRow alignItems="center" justifyContent={"space-between"}>

        {/*TODO: Replace CustomPressable by TouchableOpacity when the Multisig feature is available*/}
        <CustomPressable>
          {({hovered}) => (
            <FlexRow alignItems="center">
              <BrandText style={styles.switchAccount}>{hovered ? "Coming Soon" : "Switch Account"}</BrandText>
              <SVG source={chevronRightSVG} width={16} height={16}/>
            </FlexRow>
          )}
        </CustomPressable>

        <TouchableOpacity onPress={() => {
          navigation.navigate("UserPublicProfile", {
            id: "tori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
          });
        }}>
          <BrandText style={styles.manageProfile}>Manage Profile</BrandText>
        </TouchableOpacity>
      </FlexRow>
    </FlexCol>
  )
}


const styles = StyleSheet.create({
  container: {
    padding: layout.padding_x2,
  },
  userImageLine: {
    width: "100%",
    marginBottom: layout.padding_x1_5
  },
  switchAccount: {
    ...(fontSemibold14 as object),
    marginRight: layout.padding_x0_5
  },
  manageProfile : {
    ...(fontSemibold14 as object),
    color: purpleLight
  }
});
