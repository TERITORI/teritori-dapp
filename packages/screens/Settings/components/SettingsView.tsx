import React, {useState} from "react";
import {Pressable, StyleSheet, Switch, Text, TouchableOpacity, useWindowDimensions, View} from "react-native";
import {BrandText} from "../../../components/BrandText";
import {
  neutral00,
  neutral17,
  neutral33,
  neutral55,
  neutralA3,
  primaryColor,
  secondaryColor
} from "../../../utils/style/colors";
import {SpacerColumn} from "../../../components/spacer";
import {fontSemibold12, fontSemibold14, fontSemibold20} from "../../../utils/style/fonts";
import {TextInput} from "react-native-gesture-handler";
import {SVG} from "../../../components/SVG";
import chevronRightSVG from "../../../../assets/icons/chevron-right.svg";
import {TertiaryButton} from "../../../components/buttons/TertiaryButton";
import {PrimaryButton} from "../../../components/buttons/PrimaryButton";
import {UserProfileModal} from "./UserProfileModal";
import {layout} from "../../../utils/style/layout";

export type SettingsInfo ={
  displayTestnet: boolean;
  sales: boolean;
  successfulBids: boolean;
  doubleBids: boolean;
  expireBids: boolean;
  purchase: boolean;
  apiKey: string;
  openProfile: boolean;
  openConfirm: boolean;
}

const mobileWidth = 768;
const padWidth = 1024;

export const SettingsView: React.FC<{}> = () => {
  const { width } = useWindowDimensions();

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

  const [settingsInfo, setSettingsInfo] = useState<SettingsInfo>({
    displayTestnet: true,
    sales: true,
    successfulBids: true,
    doubleBids: true,
    expireBids: true,
    purchase: true,
    apiKey: "",
    openConfirm: false,
    openProfile: false,
  });

  const toggleUserProfileModal = () => {
    setSettingsInfo({...settingsInfo, openProfile: false});
  };

  return (<View style={styles.pageContainer}>
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={()=>{
        setSettingsInfo({...settingsInfo, displayTestnet: !settingsInfo.displayTestnet})
      }}>
      <View style={[styles.switchBox, { paddingTop: 0 }]}>

        <BrandText style={styles.cardTitle}>
          Display all Testnet Networks
        </BrandText>
        <Switch
          //@ts-expect-error type
          activeThumbColor={primaryColor}
          thumbColor={neutral55}
          trackColor={{ true: secondaryColor, false: neutralA3 }}
          onValueChange={() => setSettingsInfo({...settingsInfo, displayTestnet: !settingsInfo.displayTestnet})}
          value={settingsInfo.displayTestnet}
        />
      </View>
      </TouchableOpacity>
    </View>

    <SpacerColumn size={3} />

    <View style={styles.cardContainer}>
      <View style={[styles.switchBox, { paddingTop: 0 }]}>
        <BrandText style={styles.cardSubtitle}>
          NFT.Storage/Pinata.cloud API key (for Social Feed)
        </BrandText>
        <Pressable onPress={()=>setSettingsInfo({...settingsInfo, apiKey: ""})}>
          <Text style={[fontSemibold14, {color: primaryColor}]}>Reset to Teritoris' API key</Text>
        </Pressable>
      </View>
      <SpacerColumn size={1.5} />
      <TextInput
        style={[styles.apiInput, { outlineStyle: "none" } as any]}
        value={settingsInfo.apiKey}
        onChangeText={(value) => setSettingsInfo({...settingsInfo, apiKey: value})}
      />
    </View>

    <BrandText style={styles.bigTitle}>Notifications</BrandText>
    <BrandText style={styles.bigText}>
      Select the kinds of notifications you’d like receive to your email and
      in-app notifications center
    </BrandText>

    <SpacerColumn size={2} />

    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={()=>{
        setSettingsInfo({...settingsInfo, sales: !settingsInfo.sales})
      }}>
        <View style={[styles.switchBox, { paddingTop: 0 }]}>
          <View>
            <BrandText style={styles.cardTitle}>Sales</BrandText>
            <BrandText style={styles.cardContent}>
              When one of your NFTs sells
            </BrandText>
          </View>
          <Switch
            //@ts-expect-error type
            activeThumbColor={primaryColor}
            thumbColor={neutral55}
            trackColor={{ true: secondaryColor, false: neutralA3 }}
            onValueChange={() => setSettingsInfo({...settingsInfo, sales: !settingsInfo.sales})}
            value={settingsInfo.sales}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{
        setSettingsInfo({...settingsInfo, successfulBids: !settingsInfo.successfulBids})
      }}>
        <View style={styles.switchBox}>
          <View>
            <BrandText style={styles.cardTitle}>Successful bids</BrandText>
            <BrandText style={styles.cardContent}>
              When your bid was successful and the NFT is in your wallet
            </BrandText>
          </View>
          <Switch
            //@ts-expect-error type
            activeThumbColor={primaryColor}
            thumbColor={neutral55}
            trackColor={{ true: secondaryColor, false: neutralA3 }}
            onValueChange={() => setSettingsInfo({...settingsInfo, successfulBids: !settingsInfo.successfulBids})}
            value={settingsInfo.successfulBids}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{
        setSettingsInfo({...settingsInfo, doubleBids: !settingsInfo.doubleBids})
      }}>
        <View style={styles.switchBox}>
          <View>
            <BrandText style={styles.cardTitle}>Bids & Outbids</BrandText>
            <BrandText style={styles.cardContent}>
              When someone bids on one of your items or outbids yours bids
            </BrandText>
          </View>
          <Switch
            //@ts-expect-error type
            activeThumbColor={primaryColor}
            thumbColor={neutral55}
            trackColor={{ true: secondaryColor, false: neutralA3 }}
            onValueChange={() => setSettingsInfo({...settingsInfo, doubleBids: !settingsInfo.doubleBids})}
            value={settingsInfo.doubleBids}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{
        setSettingsInfo({...settingsInfo, expireBids: !settingsInfo.expireBids})
      }}>
        <View style={styles.switchBox}>
          <View>
            <BrandText style={styles.cardTitle}>Expired bids</BrandText>
            <BrandText style={styles.cardContent}>
              When your bid experies or gets deactivated because of
              insufficient funds
            </BrandText>
          </View>
          <Switch
            //@ts-expect-error type
            activeThumbColor={primaryColor}
            thumbColor={neutral55}
            trackColor={{ true: secondaryColor, false: neutralA3 }}
            onValueChange={() => setSettingsInfo({...settingsInfo, expireBids: !settingsInfo.expireBids})}
            value={settingsInfo.expireBids}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{
        setSettingsInfo({...settingsInfo, purchase: !settingsInfo.purchase})
      }}>
        <View style={styles.switchBox}>
          <View>
            <BrandText style={styles.cardTitle}>Purchasess</BrandText>
            <BrandText style={styles.cardContent}>
              When a purchase is successful and you have received the NFT in
              your wallet
            </BrandText>
          </View>
          <Switch
            //@ts-expect-error type
            activeThumbColor={primaryColor}
            thumbColor={neutral55}
            trackColor={{ true: secondaryColor, false: neutralA3 }}
            onValueChange={() => setSettingsInfo({...settingsInfo, purchase: !settingsInfo.purchase})}
            value={settingsInfo.purchase}
          />
        </View>
      </TouchableOpacity>
    </View>

    <SpacerColumn size={4} />

    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={()=> setSettingsInfo({...settingsInfo, openConfirm: true})}>
        <View style={[styles.switchBox, { paddingTop: 0 }]}>
          <BrandText style={styles.cardTitle}>
            Customize my User Profile
          </BrandText>
          <Pressable onPress={() => setSettingsInfo({...settingsInfo, openConfirm: true})}>
            <SVG source={chevronRightSVG} height={16} width={16} />
          </Pressable>
        </View>
      </TouchableOpacity>
    </View>

    {settingsInfo.openConfirm && (
      <View style={styles.switchBox}>
        <TertiaryButton
          size="M"
          text="Cancel"
          onPress={() => setSettingsInfo({...settingsInfo, openConfirm: false})}
        />
        <PrimaryButton
          size="M"
          text="Save"
          onPress={() => setSettingsInfo({...settingsInfo, openProfile: true})}
        />
      </View>
    )}

    <UserProfileModal
      visible={settingsInfo.openProfile}
      onClose={toggleUserProfileModal}
    />
  </View>);
};


