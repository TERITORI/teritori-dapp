import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, TextInput, useWindowDimensions } from "react-native";

import { BrandText } from "../../BrandText";
import { fontMedium13, fontSemibold14, fontSemibold16, fontSemibold20, fontSemibold28 } from "../../../utils/style/fonts";
import { neutral00, neutral33, neutral77, neutralA3, primaryColor, secondaryColor } from "../../../utils/style/colors";
import { fullSidebarWidth, layout } from "../../../utils/style/layout";
import { GeneralSelect } from "../../select/GeneralSelect";
import { TertiaryButton } from "../../buttons/TertiaryButton";
import { CheckBox } from "../../checkbox/CheckBox";
import { InputSelect } from "../../select/InputSelect";

type OccupationsDetailDataType = [string[], string[], string[], string[], string[],]

export const ProfessionalInfoPanel: React.FC = () => {

  const halfWidth = 296;
  const pageContentWidth = 877;
  const fullWidth = 612;
  const titleWidth = 200;
  const quaterWidth = 138;
  const mediumWidth = 217;

  const firstBreakPoint = 1200;
  const mobileWidth = 768;
  const smallMobileWidth = 512;

  const occupationSelectData = ["Digital Marketing", "Graphics & Design", "Writing & Translation", "Programming & Tech", "Music & Audio"]
  const yearData = ["2020", "2021", "2022", "2023"];
  const occupationDetailData = ["3D Models", "Architecture", "Business Cards & Stationary", "Banner Ads", "Covers", "Character Modeling", "Cartoons & Comics", "Character Design", "Graphics for Streamers", "Flyer Design", "Game Design", "Invitations", "Illustration", "Infographic Design", "Photoshop Editing", "Logo Design", "Packing Design", "Social Media Design", "Portraits", "Presentation Design", "Web & Mobile Design", "Merchandise", "Vector Tracing", "Other"]
  const languagesData = ["English", "Chinese", "French", "Spanish", "Arabian"];
  const languageLevelData = ["High", "Medium", "Low"];
  const skillData = ["photography", "driving", "football", "piano", "develope"];
  const skillLevelData = ["High", "Medium", "Low"];
  const countryData = ["U.S.A", "U.K", "France", "Italy", "China", "Japan"];
  const universityData = ["Oxford", "Cambridge", "Harvard", "Stanford"];
  const titleData = ["Title_1", "Title_2", "Title_3"];
  const majorData = ["Maths", "Physics", "Chemistry", "Civil Engineering"];
  const certificationData = ["certification_1", "certification_2", "certification_3", "certification_4"];
  const certificationFromData = ["Form_1", "Form_1", "Form_1", "Form_1", "Form_1", "Form_1"];

  const { width } = useWindowDimensions();

  const [selectedOccupationItem, setSelectedOccupationItem] = useState<string>("");
  const [detailClickNumber, setDetailClickNumber] = useState<number>(0);
  const [fromYear, setFromYear] = useState<string>("");
  const [toYear, setToYear] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [detailData, setDetailData] = useState<OccupationsDetailDataType>([[], [], [], [], []]);
  const [confirmedItem, setConfirmedItem] = useState<string[]>([]);
  const [confirmedClickNumber, setConfirmedClickNumber] = useState<number>(0);
  const [language, setLanguage] = useState<string>("");
  const [languageLevel, setLanguageLevel] = useState<string>("");
  const [skill, setSkill] = useState<string>("");
  const [skillLevel, setSkillLevel] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [university, setUniversity] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [major, setMajor] = useState<string>("");
  const [certification, setCertification] = useState<string>("");
  const [certificationFrom, setCertificationFrom] = useState<string>("");
  const [personalSite, setPersonalSite] = useState<string>("");

  const styles = StyleSheet.create({
    contentContainer: {
      flexDirection: "column",
      width: width < firstBreakPoint ? (width - fullSidebarWidth) * 0.9 : pageContentWidth
    },
    generalDarkText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutral77
      }
    ]),
    itemContent: {
      flexDirection: "column",
      width: pageContentWidth - 200
    },
    infoTitle: StyleSheet.flatten([
      fontSemibold20,
      {
        width: titleWidth,
        marginTop: 13
      }
    ]),
    selectYearContainer: {
      marginLeft: layout.padding_x2_5,
      flexDirection: "row",
      alignItems: "center",
      gap: layout.padding_x2_5
    },
    detailContentContainer: {
      flexDirection: "column",
      width: "100%"
    },
    detailTitle: StyleSheet.flatten([
      fontMedium13,
      {
        marginTop: layout.padding_x2
      }
    ]),
    divideLine: {
      width: "100%",
      height: 1,
      backgroundColor: neutral33
    },
    checkboxGroup: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      width: fullWidth
    },
    singleBox: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      marginVertical: 6
    },
    tickedCheckBox: {
      width: layout.padding_x2,
      height: layout.padding_x2
    },
    checkedText: StyleSheet.flatten([
      fontMedium13,
      {
        color: secondaryColor,
        marginLeft: layout.padding_x1
      }
    ]),
    twoInputBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.padding_x2_5
    },
    notCheckedText: StyleSheet.flatten([
      fontMedium13,
      {
        color: neutralA3
      }
    ]),
    textInput: StyleSheet.flatten([
      fontSemibold14,
      {
        backgroundColor: neutral00,
        borderColor: neutral33,
        borderRadius: layout.padding_x1_5,
        padding: layout.padding_x2,
        borderWidth: 1,
        color: secondaryColor,
        width: fullWidth
      }
    ]),
    itemContainer: {
      flexDirection: "row",
      marginTop: layout.padding_x4,
    },
    selectPart: {
      flexDirection: "row",
      zIndex: 999,
      justifyContent: "space-between",
      width: fullWidth
    }
  });

  const checkState = (smallItem: string, bigItem: string): boolean => {
    const currentBigIndex = occupationSelectData.indexOf(bigItem);
    if (currentBigIndex < 0) return false;

    if (detailData[currentBigIndex].includes(smallItem)) return true
    else return false;
  }

  const updateDetailData = (smallItem: string, bigItem: string) => {
    const currentBigIndex = occupationSelectData.indexOf(bigItem);

    if (checkState(smallItem, bigItem)) {
      setDetailClickNumber((value) => value + 1);
      let targetDetailIndex = detailData[currentBigIndex].indexOf(smallItem);
      let targetDetailData = detailData;
      targetDetailData[currentBigIndex].splice(targetDetailIndex, 1);
      setDetailData(targetDetailData);
    }
    else {
      setDetailClickNumber((value) => value + 1);
      let targetDetailData = detailData;
      targetDetailData[currentBigIndex].push(smallItem);
      setDetailData(targetDetailData);
    }
  }

  const updateConfirmedData = (bigItem: string) => {
    let currentBigIndex = confirmedItem.indexOf(bigItem);
    let targetData = confirmedItem;
    targetData.splice(currentBigIndex, 1);
    setConfirmedItem(targetData);
    setConfirmedClickNumber((value) => value + 1);
  };

  useEffect(() => {
    console.log(confirmedItem);
  }, [confirmedClickNumber])

  useEffect(() => {
    if (!selectedOccupationItem) return;
    occupationDetailData.map((item) => {
      checkState(item, selectedOccupationItem);
    })
  }, [selectedOccupationItem, detailClickNumber]);

  return (
    <View style={{ flexDirection: "column" }}>

      <View style={{ flexDirection: "column" }}>
        <BrandText style={[fontSemibold28]}>Professional Info</BrandText>
        <BrandText style={[fontSemibold16, { color: neutral77, marginTop: 10 }]}>
          This is your time to shine. Let potential buyers know what you do best and how you gained your skills, certifications and experience.
        </BrandText>
        <View style={[styles.divideLine, { marginVertical: 24 }]} />
      </View>

      <View style={styles.contentContainer}>

        <View style={[styles.itemContainer, { marginTop: 0, zIndex: 6 }]}>
          <BrandText style={styles.infoTitle}>Occupation</BrandText>
          <View style={styles.itemContent}>

            <View style={{ width: "100%" }}>
              <View style={styles.selectPart}>
                <GeneralSelect width={halfWidth} data={occupationSelectData} initValue="Select Occupation" value={selectedOccupationItem} setValue={setSelectedOccupationItem} />
                {selectedOccupationItem &&
                  <View style={styles.selectYearContainer}>
                    <BrandText style={styles.generalDarkText}>From</BrandText>
                    <GeneralSelect width={92} data={yearData} initValue="Year" value={fromYear} setValue={setFromYear} />
                    <BrandText style={styles.generalDarkText}>to</BrandText>
                    <GeneralSelect width={92} data={yearData} initValue="Year" value={toYear} setValue={setToYear} />
                  </View>
                }
              </View>
              {selectedOccupationItem &&
                <View style={styles.detailContentContainer}>
                  <BrandText style={styles.detailTitle}>Choose two to five of your best skills in Graphics & Design</BrandText>
                  <View style={[styles.divideLine, { marginTop: 12, marginBottom: 6, width: fullWidth }]}></View>
                  <View style={styles.checkboxGroup}>
                    {
                      occupationDetailData.map((item: string, index) => (
                        <Pressable style={{ width: `${100 / 3}%` }} key={index}>
                          <View style={styles.singleBox}>
                            <CheckBox value={checkState(item, selectedOccupationItem)} onValueChange={() => updateDetailData(item, selectedOccupationItem)} />
                            <BrandText style={styles.checkedText}>{item}</BrandText>
                          </View>
                        </Pressable>
                      ))
                    }
                    <View style={[styles.divideLine, { marginTop: 12, marginBottom: 6 }]}></View>
                    <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-end" }}>
                      <TertiaryButton size="M" text="Add" onPress={() => { if (!confirmedItem.includes(selectedOccupationItem)) setConfirmedItem([...confirmedItem, selectedOccupationItem]) }} />
                    </View>
                  </View>
                </View>
              }
            </View>

            {
              confirmedItem.map((bigItem: string, bigIndex) => (
                <View style={{ width: "100%", marginTop: layout.padding_x2_5 }} key={bigIndex}>
                  <View style={styles.selectPart}>
                    <GeneralSelect width={halfWidth} data={occupationSelectData} initValue="Select Occupation" value={bigItem} disable={true} />
                    <View style={styles.selectYearContainer}>
                      <BrandText style={styles.generalDarkText}>From</BrandText>
                      <GeneralSelect width={92} data={yearData} initValue="Year" value={fromYear} disable={true} />
                      <BrandText style={styles.generalDarkText}>to</BrandText>
                      <GeneralSelect width={92} data={yearData} initValue="Year" value={toYear} disable={true} />
                    </View>
                  </View>
                  <View style={styles.detailContentContainer}>
                    <BrandText style={styles.detailTitle}>Choose two to five of your best skills in Graphics & Design</BrandText>
                    <View style={styles.checkboxGroup}>
                      {
                        occupationDetailData.map((smallItem: string, smallIndex) => (
                          <Pressable style={{ width: `${100 / 3}%` }} key={smallIndex}>
                            <View style={styles.singleBox}>
                              <CheckBox value={checkState(smallItem, bigItem)} disable={true} />
                              <BrandText style={styles.checkedText}>{smallItem}</BrandText>
                            </View>
                          </Pressable>
                        ))
                      }
                      <View style={[styles.divideLine, { marginTop: 12, marginBottom: 6 }]}></View>
                      <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-end" }}>
                        <TertiaryButton size="M" text="Remove" onPress={() => updateConfirmedData(bigItem)} />
                      </View>
                    </View>
                  </View>
                </View>
              ))
            }

          </View>
        </View>

        <View style={[styles.itemContainer, { zIndex: 5 }]}>
          <BrandText style={styles.infoTitle}>Languages</BrandText>
          <View style={styles.itemContent}>
            <View style={{ flexDirection: "row" }}>
              <GeneralSelect width={halfWidth} data={languagesData} initValue="Language" value={language} setValue={setLanguage} style={{ marginRight: layout.padding_x2_5 }} />
              <GeneralSelect width={halfWidth} data={languageLevelData} initValue="Language Level" value={languageLevel} setValue={setLanguageLevel} style={{ marginRight: layout.padding_x2_5 }} />
              <TertiaryButton size="M" text="Add" />
            </View>
          </View>
        </View>

        <View style={[styles.itemContainer, { zIndex: 4 }]}>
          <BrandText style={styles.infoTitle}>Skills</BrandText>
          <View style={styles.itemContent}>
            <View style={{ flexDirection: "row" }}>
              <InputSelect width={halfWidth} data={skillData} initValue="Add skill(e.g. Voice Talent)" value={skill} setValue={setSkill} style={{ marginRight: layout.padding_x2_5 }} />
              <GeneralSelect width={halfWidth} data={skillLevelData} initValue="Language Level" value={skillLevel} setValue={setSkillLevel} style={{ marginRight: layout.padding_x2_5 }} />
              <TertiaryButton size="M" text="Add" />
            </View>
          </View>
        </View>

        <View style={[styles.itemContainer, { zIndex: 3 }]}>
          <BrandText style={styles.infoTitle}>Education</BrandText>
          <View style={styles.itemContent}>
            <View style={{ flexDirection: "row", zIndex: 2 }}>
              <GeneralSelect width={halfWidth} data={countryData} initValue="Country of College/University" value={country} setValue={setCountry} style={{ marginRight: layout.padding_x2_5 }} />
              <GeneralSelect width={halfWidth} data={universityData} initValue="College/University Name" value={university} setValue={setUniversity} />
            </View>
            <View style={{ flexDirection: "row", marginTop: layout.padding_x2_5, zIndex: 1 }}>
              <GeneralSelect width={quaterWidth} data={titleData} initValue="Title" value={title} setValue={setTitle} style={{ marginRight: layout.padding_x2_5 }} />
              <GeneralSelect width={halfWidth} data={majorData} initValue="Major" value={major} setValue={setMajor} style={{ marginRight: layout.padding_x2_5 }} />
              <GeneralSelect width={quaterWidth} data={yearData} initValue="Year" value={year} setValue={setYear} style={{ marginRight: layout.padding_x2_5 }} />
              <TertiaryButton size="M" text="Add" />
            </View>
          </View>
        </View>

        <View style={[styles.itemContainer, { zIndex: 2 }]}>
          <BrandText style={styles.infoTitle}>Certification</BrandText>
          <View style={styles.itemContent}>
            <View style={{ flexDirection: "row" }}>
              <GeneralSelect width={mediumWidth} data={certificationData} initValue="Certificate or Award" value={certification} setValue={setCertification} style={{ marginRight: layout.padding_x2_5 }} />
              <GeneralSelect width={mediumWidth} data={certificationFromData} initValue="Certified From (Adobe)" value={certificationFrom} setValue={setCertificationFrom} style={{ marginRight: layout.padding_x2_5 }} />
              <GeneralSelect width={quaterWidth} data={yearData} initValue="Year" value={year} setValue={setYear} style={{ marginRight: layout.padding_x2_5 }} />
              <TertiaryButton size="M" text="Add" />
            </View>
          </View>
        </View>

        <View style={[styles.itemContainer, { zIndex: 1 }]}>
          <BrandText style={styles.infoTitle}>Personal Site</BrandText>
          <View style={styles.itemContent}>
            <TextInput style={[styles.textInput, { outlineStyle: "none" } as any]} value={personalSite} onChangeText={(value) => setPersonalSite(value)} placeholder="Provide a link to your own website" placeholderTextColor={neutral77} />
          </View>
        </View>

      </View>

    </View>
  )
}