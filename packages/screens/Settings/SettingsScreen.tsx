import { useState } from "react";
import {
  View,
  StyleSheet,
  Switch,
  useWindowDimensions,
  Pressable,
  Text,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
// import { useSelector } from "react-redux";

import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { TertiaryButton } from "../../components/buttons/TertiaryButton";
import { SpacerColumn } from "../../components/spacer";
// import { selectAreTestnetsEnabled } from "../../store/slices/settings";
// import { useAppDispatch } from "../../store/store";
import { ScreenFC } from "../../utils/navigation";
import {
  primaryColor,
  secondaryColor,
  neutralA3,
  neutral17,
  neutral55,
  neutral00,
  neutral33,
} from "../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold14,
  fontSemibold20,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { UserProfileModal } from "./components/UserProfileModal";

const mobileWidth = 768;
const padWidth = 1024;

export const SettingsScreen: ScreenFC<"Settings"> = () => {
  const { width } = useWindowDimensions();

  // const testnetsEnabled = useSelector(selectAreTestnetsEnabled);
  // const dispatch = useAppDispatch();

  const [displayTestnet, setDisplayTestnet] = useState<boolean>(true);
  const [sales, setSales] = useState<boolean>(true);
  const [successfulBids, setSuccessfulBids] = useState<boolean>(true);
  const [doubleBids, setDoubleBids] = useState<boolean>(true);
  const [expiredBids, setExpiredBids] = useState<boolean>(true);
  const [purchase, setPurchase] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>("");

  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const toggleUserProfileModal = () => {
    setOpenProfile(false);
  };

  const styles = StyleSheet.create({
    pageContainer: {
      width:
        width < padWidth
          ? width < mobileWidth
            ? (width - 75) * 0.9
            : (width - 209) * 0.9
          : 676,
      margin: "auto",
      paddingTop: layout.contentPadding,
    },
    cardTitle: StyleSheet.flatten([fontSemibold14]),
    cardSubtitle: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutralA3,
      },
    ]),
    cardContent: StyleSheet.flatten([
      fontSemibold12,
      {
        color: neutralA3,
        paddingTop: layout.padding_x0_5,
        width:
          width < mobileWidth
            ? (width - 75) * 0.9 - 2 * layout.padding_x2 - 50
            : undefined,
      },
    ]),
    apiInput: {
      fontSize: 14,
      color: "white",
      fontFamily: "Exo_600SemiBold",
      padding: layout.padding_x2,
      borderColor: neutral33,
      borderWidth: 1,
      backgroundColor: neutral00,
      borderRadius: layout.padding_x1_5,
    },
    cardContainer: {
      width: "100%",
      borderRadius: layout.padding_x1_5,
      backgroundColor: neutral17,
      padding: layout.padding_x2,
    },
    switchBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: layout.padding_x2_5,
    },
    bigTitle: StyleSheet.flatten([
      fontSemibold20,
      {
        paddingTop: layout.padding_x4,
        paddingLeft: layout.padding_x2,
      },
    ]),
    bigText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutralA3,
        paddingLeft: layout.padding_x2,
        paddingTop: layout.padding_x1,
      },
    ]),
    textBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
  });

  return (
    <ScreenContainer noMargin fullWidth>
      <View style={styles.pageContainer}>
        <View style={styles.cardContainer}>
          <View style={[styles.switchBox, { paddingTop: 0 }]}>
            <BrandText style={styles.cardTitle}>
              Display all Testnet Networks
            </BrandText>
            <Switch
              thumbColor={displayTestnet ? primaryColor : neutral55}
              trackColor={{ true: secondaryColor, false: neutralA3 }}
              onValueChange={() => setDisplayTestnet((value) => !value)}
              value={displayTestnet}
            />
          </View>
        </View>

        <SpacerColumn size={3} />

        <View style={styles.cardContainer}>
          <View style={[styles.switchBox, { paddingTop: 0 }]}>
            <BrandText style={styles.cardSubtitle}>
              NFT.Storage/Pinata.cloud API key (for Social Feed)
            </BrandText>
            <Pressable onPress={() => setApiKey("")}>
              <Text style={[fontSemibold14, { color: primaryColor }]}>
                Reset to Teritoris' API key
              </Text>
            </Pressable>
          </View>
          <SpacerColumn size={1.5} />
          <TextInput
            style={[styles.apiInput, { outlineStyle: "none" } as any]}
            value={apiKey}
            onChangeText={(value) => setApiKey(value)}
          />
        </View>

        <BrandText style={styles.bigTitle}>Notifications</BrandText>
        <BrandText style={styles.bigText}>
          Select the kinds of notifications you’d like receive to your email and
          in-app notifications center
        </BrandText>

        <SpacerColumn size={2} />

        <View style={styles.cardContainer}>
          <View style={[styles.switchBox, { paddingTop: 0 }]}>
            <View>
              <BrandText style={styles.cardTitle}>Sales</BrandText>
              <BrandText style={styles.cardContent}>
                When one of your NFTs sells
              </BrandText>
            </View>
            <Switch
              thumbColor={sales ? primaryColor : neutral55}
              trackColor={{ true: secondaryColor, false: neutralA3 }}
              onValueChange={() => setSales((value) => !value)}
              value={sales}
            />
          </View>
          <View style={styles.switchBox}>
            <View>
              <BrandText style={styles.cardTitle}>Successful bids</BrandText>
              <BrandText style={styles.cardContent}>
                When your bid was successful and the NFT is in your wallet
              </BrandText>
            </View>
            <Switch
              thumbColor={successfulBids ? primaryColor : neutral55}
              trackColor={{ true: secondaryColor, false: neutralA3 }}
              onValueChange={() => setSuccessfulBids((value) => !value)}
              value={successfulBids}
            />
          </View>
          <View style={styles.switchBox}>
            <View>
              <BrandText style={styles.cardTitle}>Bids & Outbids</BrandText>
              <BrandText style={styles.cardContent}>
                When someone bids on one of your items or outbids yours bids
              </BrandText>
            </View>
            <Switch
              thumbColor={doubleBids ? primaryColor : neutral55}
              trackColor={{ true: secondaryColor, false: neutralA3 }}
              onValueChange={() => setDoubleBids((value) => !value)}
              value={doubleBids}
            />
          </View>
          <View style={styles.switchBox}>
            <View>
              <BrandText style={styles.cardTitle}>Expired bids</BrandText>
              <BrandText style={styles.cardContent}>
                When your bid experies or gets deactivated because of
                insufficient funds
              </BrandText>
            </View>
            <Switch
              thumbColor={expiredBids ? primaryColor : neutral55}
              trackColor={{ true: secondaryColor, false: neutralA3 }}
              onValueChange={() => setExpiredBids((value) => !value)}
              value={expiredBids}
            />
          </View>
          <View style={styles.switchBox}>
            <View>
              <BrandText style={styles.cardTitle}>Purchasess</BrandText>
              <BrandText style={styles.cardContent}>
                When a purchase is successful and you have received the NFT in
                your wallet
              </BrandText>
            </View>
            <Switch
              thumbColor={purchase ? primaryColor : neutral55}
              trackColor={{ true: secondaryColor, false: neutralA3 }}
              onValueChange={() => setPurchase((value) => !value)}
              value={purchase}
            />
          </View>
        </View>

        <SpacerColumn size={4} />

        <View style={styles.cardContainer}>
          <View style={[styles.switchBox, { paddingTop: 0 }]}>
            <BrandText style={styles.cardTitle}>
              Customize my User Profile
            </BrandText>
            <Pressable onPress={() => setOpenConfirm(true)}>
              <SVG source={chevronRightSVG} height={16} width={16} />
            </Pressable>
          </View>
        </View>

        {openConfirm && (
          <View style={styles.switchBox}>
            <TertiaryButton
              size="M"
              text="Cancel"
              onPress={() => setOpenConfirm(false)}
            />
            <PrimaryButton
              size="M"
              text="Save"
              onPress={() => setOpenProfile(true)}
            />
          </View>
        )}

        <UserProfileModal
          visible={openProfile}
          onClose={toggleUserProfileModal}
        />
      </View>
    </ScreenContainer>
  );
};
