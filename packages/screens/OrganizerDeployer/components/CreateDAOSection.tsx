import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { neutral33, neutral77 } from "../../../utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { CreateDaoFormType } from "../types";
import { ImagePicker } from "./ImagePicker";
import { RadioDescriptionSelector } from "./RadioDescriptionSelector";

const RADIO_DESCRIPTION_TYPES = ["Membership", "Governance", "Decentralized"];
export const CreateDAOSection = () => {
  // variables
  const [selectedRadioDescription, setselectedRadioDescription] = useState(
    RADIO_DESCRIPTION_TYPES[0]
  );

  // returns
  return (
    <View style={styles.container}>
      <BrandText style={fontSemibold28}>
        Create a Teritori Organization
      </BrandText>
      <SpacerColumn size={2} />
      <BrandText style={styles.sectionTitle}>Claim a name</BrandText>
      <SpacerColumn size={2.5} />
      <View style={styles.section}>
        <ImagePicker />
        <SpacerRow size={2.5} />
        <View style={styles.fill}>
          <View style={styles.row}>
            <View style={styles.fill}>
              <TextInputCustom<CreateDaoFormType>
                variant="noCropBorder"
                label="Organization's name"
                placeHolder="Type organization's name here"
                name="organizationName"
                rules={{ required: true }}
                isAsterickSign
              />
            </View>
            <SpacerRow size={2.5} />
            <View style={styles.fill}>
              <TextInputCustom<CreateDaoFormType>
                variant="noCropBorder"
                label="Associated Teritori Name Service"
                placeHolder="your-organization.teri"
                name="associatedTeritoriNameService"
                rules={{ required: true }}
                isAsterickSign
              />
            </View>
          </View>
          <SpacerColumn size={2.5} />
          <TextInputCustom<CreateDaoFormType>
            variant="noCropBorder"
            label="Organization's description"
            placeHolder="Type organization's description here"
            name="organizationDescription"
            rules={{ required: true }}
            isAsterickSign
            numberOfLines={3}
          />
        </View>
      </View>

      <BrandText style={styles.sectionTitle}>Choose a structure</BrandText>
      <SpacerColumn size={2} />
      <View style={styles.row}>
        <View style={styles.fill}>
          <RadioDescriptionSelector
            selected={selectedRadioDescription === RADIO_DESCRIPTION_TYPES[0]}
            onPress={() =>
              setselectedRadioDescription(RADIO_DESCRIPTION_TYPES[0])
            }
            title="Membership-based TORG - Teritori Organization"
            description="Small organization with a few members who are likely to stick around. Members can be added and removed by a vote of existing members."
          />
        </View>
        <SpacerRow size={2} />
        <View style={styles.fill}>
          <RadioDescriptionSelector
            selected={selectedRadioDescription === RADIO_DESCRIPTION_TYPES[1]}
            onPress={() =>
              setselectedRadioDescription(RADIO_DESCRIPTION_TYPES[1])
            }
            title="Governance Token-based TORG - Teritori Organization"
            description="Fluid organization with many members who leave and join frequently. Members can join and leave by exchanging governance shares."
          />
        </View>
      </View>
      <SpacerColumn size={2} />
      <View style={styles.row}>
        <View style={styles.fill}>
          <RadioDescriptionSelector
            selected={selectedRadioDescription === RADIO_DESCRIPTION_TYPES[2]}
            onPress={() =>
              setselectedRadioDescription(RADIO_DESCRIPTION_TYPES[2])
            }
            title="Decentralized Coop Org"
            description="A cooperative company is based on a simple rule: 1 people = 1 voice, whatever the number of holded tokens."
          />
        </View>
        <SpacerRow size={2} />
        <View style={styles.fill} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: layout.contentPadding,
    paddingRight: layout.padding_x2_5,
  },
  sectionTitle: StyleSheet.flatten([fontSemibold20, { color: neutral77 }]),
  section: {
    borderRadius: 12,
    borderColor: neutral33,
    borderWidth: 1,
    padding: layout.padding_x2_5,
    flexDirection: "row",
    marginBottom: layout.padding_x4,
  },
  row: { flexDirection: "row" },
  fill: { flex: 1 },
});
