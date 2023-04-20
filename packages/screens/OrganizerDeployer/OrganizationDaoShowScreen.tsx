import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Image } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SpacerColumn } from "../../components/spacer";
import { ScreenFC } from "../../utils/navigation";
import { neutral33, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { Tabs } from "../../components/tabs/Tabs";
import { DaoProposalList } from "./components/DaoProposalList";
import { DaoMemberList } from "./components/DaoMemberList";
import { DaoInfo } from "./types";
const CONTAINER_MARGIN_HORIZONTAL = 32;

export const OrganizationDaoShowScreen: ScreenFC<"OrganizationDaoShow"> = ({
  route: {
    params: { address },
  },
}) => {
  const daoInfo: DaoInfo = {
    name: "Juno Growth Fund",
    imgUrl: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    date: "Est. November 2022",
    description: "The Juno Growth Fund is an official SubDAO of Juno Network, responsible for the long-term growth and sustainability of the network, and seeks to enable the builders which will help accrue substantial value to Juno Network and JUNO stakers.",
    address,
    treasury: "$249.10K est. USD value",
    members: "11"
  };

  const tabs = {
    proposals: {
      name: "Proposals"
    },
    members: {
      name: "Members"      
    },
  };
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabs>("proposals");  
  // returns
  return (
    <ScreenContainer
      headerChildren={<BrandText>{daoInfo.name}</BrandText>}
      footerChildren={<></>}
      noScroll
      isHeaderSmallMargin
    >
      <ScrollView style={styles.container}>
        <View style={{ paddingBottom:  layout.padding_x2_5, borderBottomWidth: 1, borderColor: neutral33}}>
          <View
            style={[ styles.row, { marginTop: layout.padding_x2_5 }]}>
            <Image
              source={{
                uri: daoInfo.imgUrl,
              }}
              style={ styles.image }
            />
          </View>
          <SpacerColumn size={3} />
          <View style={ styles.row }>
            <BrandText style={styles.text}>
              {daoInfo.name}
            </BrandText>
          </View>
          <SpacerColumn size={3} />
          <View style={ styles.row }>
            <BrandText style={styles.textGray}>
              {daoInfo.date}
            </BrandText>
          </View>
          <SpacerColumn size={3} />
          <View style={ styles.row }>
            <BrandText style={[styles.textGray, {width: 500}]}>
              {daoInfo.description}
            </BrandText>
          </View>
          <SpacerColumn size={3} />
          <View style={{flexDirection: "row"}}>
            <View style={styles.item}>
              <BrandText style={styles.textGray}>Dao's address</BrandText>
              <SpacerColumn size={2} />
              <BrandText style={styles.text}>{tinyAddress(daoInfo.address, 16)}</BrandText>
            </View>
            <View style={styles.item}>
              <BrandText style={styles.textGray}>DAO Treasury</BrandText>     
              <SpacerColumn size={2} />       
              <BrandText style={styles.text}>{daoInfo.treasury}</BrandText>
            </View>
            <View style={styles.item}>
              <BrandText style={styles.textGray}>Members</BrandText>
              <SpacerColumn size={2} />
              <BrandText style={styles.text}>{daoInfo.members}</BrandText>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <Tabs
              items={tabs}
              onSelect={setSelectedTab}
              style={{ height: 44 }}
              selected={selectedTab}
            />
        </View>
        {selectedTab === "proposals" && 
          <DaoProposalList daoInfo={daoInfo}/>
        }
        {
          selectedTab === "members" &&
          <DaoMemberList />
        }

      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginHorizontal: CONTAINER_MARGIN_HORIZONTAL,
    marginTop: layout.padding_x2_5,
  },
  row: {
    flexDirection: "row", justifyContent: "center"
  },
  item: {
    flexGrow: 1,
    alignItems: "center"    
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 9999,
    padding: 4,
  },
  text: StyleSheet.flatten([
    fontSemibold14,
    {
      color: secondaryColor      
    },
  ]),
  textGray: StyleSheet.flatten([
    fontSemibold14,
    {
      color: secondaryColor,
      opacity: 0.5,
    },
  ]),
});
