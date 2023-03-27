import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";

import trashSVG from "../../../../assets/icons/trash.svg";
import {
  CertificationInfo,
  LangInfo,
  Occupation,
  SellerInfo,
  SkillInfo,
} from "../../../screens/FreelanceServices/types/fields";
import {
  neutral00,
  neutral33,
  neutral77,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontMedium13,
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
  fontSemibold28,
} from "../../../utils/style/fonts";
import { fullSidebarWidth, layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryButton } from "../../buttons/TertiaryButton";
import { CheckBox } from "../../checkbox/CheckBox";
import { GeneralSelect } from "../../select/GeneralSelect";
import { InputSelect } from "../../select/InputSelect";

export const ProfessionalInfoPanel: React.FC<{
  seller: SellerInfo;
  setSeller: React.Dispatch<React.SetStateAction<SellerInfo>>;
}> = ({ seller, setSeller }) => {
  const halfWidth = 296;
  const pageContentWidth = 877;
  const fullWidth = 612;
  const titleWidth = 200;
  const quaterWidth = 138;
  const mediumWidth = 217;

  const firstBreakPoint = 1200;

  const occupationSelectData = [
    "Digital Marketing",
    "Graphics & Design",
    "Writing & Translation",
    "Programming & Tech",
    "Music & Audio",
  ];
  const yearData = ["2020", "2021", "2022", "2023"];
  const occupationDetailData = {
    "Digital Marketing": [
      "3D Models",
      "Architecture",
      "Business Cards & Stationary",
      "Banner Ads",
      "Covers",
      "Character Modeling",
      "Cartoons & Comics",
      "Character Design",
      "Graphics for Streamers",
      "Flyer Design",
      "Game Design",
      "Invitations",
      "Illustration",
      "Infographic Design",
      "Photoshop Editing",
      "Logo Design",
      "Packing Design",
      "Social Media Design",
      "Portraits",
      "Presentation Design",
      "Web & Mobile Design",
      "Merchandise",
      "Vector Tracing",
      "Other",
    ],
    "Graphics & Design": ["Graphics1", "Graphics2", "Other"],
    "Writing & Translation": ["Writing1", "Writing2", "Other"],
    "Programming & Tech": ["Program1", "Program2", "Other"],
    "Music & Audio": ["Music1", "Music2", "Other"],
  } as any;

  const languagesData = ["English", "Chinese", "French", "Spanish", "Arabian"];
  const languageLevelData = ["High", "Medium", "Low"];
  const skillData = ["photography", "driving", "football", "piano", "develope"];
  const skillLevelData = ["High", "Medium", "Low"];
  const countryData = ["U.S.A", "U.K", "France", "Italy", "China", "Japan"];
  const universityData = ["Oxford", "Cambridge", "Harvard", "Stanford"];
  const titleData = ["Title_1", "Title_2", "Title_3"];
  const majorData = ["Maths", "Physics", "Chemistry", "Civil Engineering"];
  const certificationData = [
    "certification_1",
    "certification_2",
    "certification_3",
    "certification_4",
  ];
  const certificationFromData = [
    "Form_1",
    "Form_1",
    "Form_1",
    "Form_1",
    "Form_1",
    "Form_1",
  ];

  const { width } = useWindowDimensions();

  const [selectedOccupationItem, setSelectedOccupationItem] =
    useState<string>("");
  const [fromYear, setFromYear] = useState<string>("");
  const [toYear, setToYear] = useState<string>("");
  const [educationYear, setEducationYear] = useState<string>("");
  const [certificationYear, setCertificationYear] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<string[]>([]);
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

  const styles = StyleSheet.create({
    contentContainer: {
      flexDirection: "column",
      width:
        width < firstBreakPoint
          ? (width - fullSidebarWidth) * 0.9
          : pageContentWidth,
    },
    generalDarkText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutral77,
      },
    ]),
    itemContent: {
      flexDirection: "column",
      width: pageContentWidth - 200,
    },
    infoTitle: StyleSheet.flatten([
      fontSemibold20,
      {
        width: titleWidth,
        marginTop: 13,
      },
    ]),
    selectYearContainer: {
      marginLeft: layout.padding_x2_5,
      flexDirection: "row",
      alignItems: "center",
      gap: layout.padding_x2_5,
    },
    detailContentContainer: {
      flexDirection: "column",
      width: "100%",
    },
    detailTitle: StyleSheet.flatten([
      fontMedium13,
      {
        marginTop: layout.padding_x2,
      },
    ]),
    divideLine: {
      width: "100%",
      height: 1,
      backgroundColor: neutral33,
    },
    checkboxGroup: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      width: fullWidth,
    },
    singleBox: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      marginVertical: 6,
    },
    tickedCheckBox: {
      width: layout.padding_x2,
      height: layout.padding_x2,
    },
    checkedText: StyleSheet.flatten([
      fontMedium13,
      {
        color: secondaryColor,
        marginLeft: layout.padding_x1,
      },
    ]),
    twoInputBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.padding_x2_5,
    },
    notCheckedText: StyleSheet.flatten([
      fontMedium13,
      {
        color: neutralA3,
      },
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
        width: fullWidth,
      },
    ]),
    itemContainer: {
      flexDirection: "row",
      marginTop: layout.padding_x4,
    },
    selectPart: {
      flexDirection: "row",
      zIndex: 999,
      justifyContent: "space-between",
      width: fullWidth,
    },
  });

  const checkState = (item: string, itemList: string[]): boolean => {
    return itemList.includes(item);
  };

  const updateDetailData = (item: string) => {
    if (checkState(item, selectedItem)) {
      const index = selectedItem.indexOf(item);
      selectedItem.splice(index, 1);
      setSelectedItem(selectedItem);
    } else {
      selectedItem.push(item);
      setSelectedItem([...selectedItem]);
    }
  };

  return (
    <View style={{ flexDirection: "column" }}>
      <View style={{ flexDirection: "column" }}>
        <BrandText style={[fontSemibold28]}>Professional Info</BrandText>
        <BrandText
          style={[fontSemibold16, { color: neutral77, marginTop: 10 }]}
        >
          This is your time to shine. Let potential buyers know what you do best
          and how you gained your skills, certifications and experience.
        </BrandText>
        <View style={[styles.divideLine, { marginVertical: 24 }]} />
      </View>

      <View style={styles.contentContainer}>
        <View style={[styles.itemContainer, { marginTop: 0, zIndex: 11 }]}>
          <BrandText style={styles.infoTitle}>Occupation</BrandText>
          <View style={styles.itemContent}>
            <View style={{ width: "100%", zIndex: 2 }}>
              <View style={styles.selectPart}>
                <GeneralSelect
                  width={halfWidth}
                  data={occupationSelectData}
                  initValue="Select Occupation"
                  value={selectedOccupationItem}
                  setValue={setSelectedOccupationItem}
                />
                {selectedOccupationItem !== "" && (
                  <View style={styles.selectYearContainer}>
                    <BrandText style={styles.generalDarkText}>From</BrandText>
                    <GeneralSelect
                      width={92}
                      data={yearData}
                      initValue="Year"
                      value={fromYear}
                      setValue={setFromYear}
                    />
                    <BrandText style={styles.generalDarkText}>to</BrandText>
                    <GeneralSelect
                      width={92}
                      data={yearData}
                      initValue="Year"
                      value={toYear}
                      setValue={setToYear}
                    />
                  </View>
                )}
              </View>
              {selectedOccupationItem !== "" && (
                <View style={styles.detailContentContainer}>
                  <BrandText style={styles.detailTitle}>
                    Choose two to five of your best skills in{" "}
                    {selectedOccupationItem}
                  </BrandText>
                  <View
                    style={[
                      styles.divideLine,
                      { marginTop: 12, marginBottom: 6, width: fullWidth },
                    ]}
                  />
                  <View style={styles.checkboxGroup}>
                    {occupationDetailData[selectedOccupationItem].map(
                      (item: string, index: number) => (
                        <Pressable style={{ width: `${100 / 3}%` }} key={index}>
                          <View style={styles.singleBox}>
                            <CheckBox
                              value={checkState(item, selectedItem)}
                              onValueChange={() => updateDetailData(item)}
                            />
                            <BrandText style={styles.checkedText}>
                              {item}
                            </BrandText>
                          </View>
                        </Pressable>
                      )
                    )}
                    <View
                      style={[
                        styles.divideLine,
                        { marginTop: 12, marginBottom: 6 },
                      ]}
                    />
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <TertiaryButton
                        size="M"
                        text="Add"
                        onPress={() => {
                          const occupations = seller.occupations;
                          if (!fromYear || !toYear) return;
                          if (
                            !occupations.find(
                              (item) =>
                                item.occupationId === selectedOccupationItem
                            )
                          ) {
                            occupations.push({
                              occupationId: selectedOccupationItem,
                              occupationNames: selectedItem,
                              from: parseInt(fromYear, 10),
                              to: parseInt(toYear, 10),
                            } as Occupation);
                            setSeller({ ...seller, occupations });
                          }
                          // if (!confirmedItem.includes(selectedOccupationItem)) setConfirmedItem([...confirmedItem, selectedOccupationItem]) }
                        }}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
            {seller.occupations.map((item: Occupation, bigIndex: number) => (
              <View
                style={{ width: "100%", marginTop: layout.padding_x2_5 }}
                key={bigIndex}
              >
                <View style={styles.selectPart}>
                  <GeneralSelect
                    width={halfWidth}
                    data={occupationSelectData}
                    initValue="Select Occupation"
                    value={item.occupationId}
                    disable
                  />
                  <View style={styles.selectYearContainer}>
                    <BrandText style={styles.generalDarkText}>From</BrandText>
                    <GeneralSelect
                      width={92}
                      data={yearData}
                      initValue="Year"
                      value={item.from.toString()}
                      disable
                    />
                    <BrandText style={styles.generalDarkText}>to</BrandText>
                    <GeneralSelect
                      width={92}
                      data={yearData}
                      initValue="Year"
                      value={item.to.toString()}
                      disable
                    />
                  </View>
                </View>
                <View style={styles.detailContentContainer}>
                  <View style={styles.checkboxGroup}>
                    {occupationDetailData[item.occupationId].map(
                      (smallItem: string, smallIndex: number) => (
                        <Pressable
                          style={{ width: `${100 / 3}%` }}
                          key={smallIndex}
                        >
                          <View style={styles.singleBox}>
                            <CheckBox
                              value={item.occupationNames.includes(smallItem)}
                              disable
                            />
                            <BrandText style={styles.checkedText}>
                              {smallItem}
                            </BrandText>
                          </View>
                        </Pressable>
                      )
                    )}
                    <View
                      style={[
                        styles.divideLine,
                        { marginTop: 12, marginBottom: 6 },
                      ]}
                    />
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <TertiaryButton
                        size="M"
                        text="Remove"
                        onPress={() => {
                          const occupations = seller.occupations;
                          occupations.splice(bigIndex, 1);
                          setSeller({ ...seller, occupations });
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.itemContainer, { zIndex: 10 }]}>
          <BrandText style={styles.infoTitle}>Languages</BrandText>
          <View style={styles.itemContent}>
            <View style={{ flexDirection: "row", zIndex: 1 }}>
              <GeneralSelect
                width={halfWidth}
                data={languagesData}
                initValue="Language"
                value={language}
                setValue={setLanguage}
                style={{ marginRight: layout.padding_x2_5 }}
              />
              <GeneralSelect
                width={halfWidth}
                data={languageLevelData}
                initValue="Language Level"
                value={languageLevel}
                setValue={setLanguageLevel}
                style={{ marginRight: layout.padding_x2_5 }}
              />
              <TertiaryButton
                size="M"
                text="Add"
                onPress={() => {
                  const languages = seller.languages;
                  if (!language || !languageLevel) return;
                  if (!languages.find((item) => item.name === language)) {
                    languages.push({
                      name: language,
                      level: languageLevel,
                    } as LangInfo);
                    setSeller({ ...seller, languages });
                  }
                }}
              />
            </View>
            <View style={{ flexDirection: "column" }}>
              {seller.languages.map((value, index) => (
                <View
                  key={`langinfo-${index}`}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginTop: 16,
                  }}
                >
                  <BrandText
                    style={[
                      fontSemibold16,
                      { color: neutral77, paddingVertical: 5 },
                    ]}
                  >
                    {value.name} - {value.level}
                  </BrandText>
                  <TouchableOpacity
                    style={{
                      alignItems: "flex-start",
                      justifyContent: "center",
                      marginLeft: 10,
                    }}
                    onPress={() => {
                      const languages = seller.languages;
                      languages.splice(index, 1);
                      setSeller({ ...seller, languages });
                    }}
                  >
                    <SVG
                      source={trashSVG}
                      width={24}
                      height={24}
                      style={{ marginTop: 2 }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.itemContainer, { zIndex: 9 }]}>
          <BrandText style={styles.infoTitle}>Skills</BrandText>
          <View style={styles.itemContent}>
            <View style={{ flexDirection: "row", zIndex: 1 }}>
              <InputSelect
                width={halfWidth}
                data={skillData}
                initValue="Add skill(e.g. Voice Talent)"
                value={skill}
                setValue={setSkill}
                style={{ marginRight: layout.padding_x2_5 }}
              />
              <GeneralSelect
                width={halfWidth}
                data={skillLevelData}
                initValue="Skill Level"
                value={skillLevel}
                setValue={setSkillLevel}
                style={{ marginRight: layout.padding_x2_5 }}
              />
              <TertiaryButton
                size="M"
                text="Add"
                onPress={() => {
                  const skills = seller.skills;
                  if (!skill || !skillLevel) return;
                  if (!skills.find((item) => item.name === skill)) {
                    skills.push({
                      name: skill,
                      level: skillLevel,
                    } as SkillInfo);
                    setSeller({ ...seller, skills });
                  }
                }}
              />
            </View>
            <View style={{ flexDirection: "column" }}>
              {seller.skills.map((value, index) => (
                <View
                  key={`skillinfo-${index}`}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginTop: 16,
                  }}
                >
                  <BrandText
                    style={[
                      fontSemibold16,
                      { color: neutral77, paddingVertical: 5 },
                    ]}
                  >
                    {value.name} - {value.level}
                  </BrandText>
                  <TouchableOpacity
                    style={{
                      alignItems: "flex-start",
                      justifyContent: "center",
                      marginLeft: 10,
                    }}
                    onPress={() => {
                      const skills = seller.skills;
                      skills.splice(index, 1);
                      setSeller({ ...seller, skills });
                    }}
                  >
                    <SVG
                      source={trashSVG}
                      width={24}
                      height={24}
                      style={{ marginTop: 2 }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.itemContainer, { zIndex: 8 }]}>
          <BrandText style={styles.infoTitle}>Education</BrandText>
          <View style={styles.itemContent}>
            <View style={{ flexDirection: "row", zIndex: 2 }}>
              <GeneralSelect
                width={halfWidth}
                data={countryData}
                initValue="Country of College/University"
                value={country}
                setValue={setCountry}
                style={{ marginRight: layout.padding_x2_5 }}
              />
              <GeneralSelect
                width={halfWidth}
                data={universityData}
                initValue="College/University Name"
                value={university}
                setValue={setUniversity}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: layout.padding_x2_5,
                zIndex: 1,
              }}
            >
              <GeneralSelect
                width={quaterWidth}
                data={titleData}
                initValue="Title"
                value={title}
                setValue={setTitle}
                style={{ marginRight: layout.padding_x2_5 }}
              />
              <GeneralSelect
                width={halfWidth}
                data={majorData}
                initValue="Major"
                value={major}
                setValue={setMajor}
                style={{ marginRight: layout.padding_x2_5 }}
              />
              <GeneralSelect
                width={quaterWidth}
                data={yearData}
                initValue="Year"
                value={educationYear}
                setValue={setEducationYear}
                style={{ marginRight: layout.padding_x2_5 }}
              />
              <TertiaryButton
                size="M"
                text="Add"
                onPress={() => {
                  const educations = seller.educations;
                  if (
                    !country ||
                    !university ||
                    !title ||
                    !major ||
                    !educationYear
                  )
                    return;
                  if (
                    !educations.find(
                      (item) =>
                        item.country === country &&
                        item.universityName === university
                    )
                  ) {
                    educations.push({
                      country,
                      universityName: university,
                      major,
                      title,
                      year: parseInt(educationYear, 10),
                    });
                    setSeller({ ...seller, educations });
                  }
                }}
              />
            </View>
            <View style={{ flexDirection: "column" }}>
              {seller.educations.map((value, index) => (
                <View
                  key={`educationinfo-${index}`}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginTop: 16,
                  }}
                >
                  <BrandText
                    style={[
                      fontSemibold16,
                      { color: neutral77, paddingVertical: 5 },
                    ]}
                  >
                    {value.title} - {value.major}, {value.year},{" "}
                    {value.universityName}, {value.country}
                  </BrandText>
                  <TouchableOpacity
                    style={{
                      alignItems: "flex-start",
                      justifyContent: "center",
                      marginLeft: 10,
                    }}
                    onPress={() => {
                      const educations = seller.educations;
                      educations.splice(index, 1);
                      setSeller({ ...seller, educations });
                    }}
                  >
                    <SVG
                      source={trashSVG}
                      width={24}
                      height={24}
                      style={{ marginTop: 2 }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.itemContainer, { zIndex: 7 }]}>
          <BrandText style={styles.infoTitle}>Certification</BrandText>
          <View style={styles.itemContent}>
            <View style={{ flexDirection: "row", zIndex: 2 }}>
              <GeneralSelect
                width={mediumWidth}
                data={certificationData}
                initValue="Certificate or Award"
                value={certification}
                setValue={setCertification}
                style={{ marginRight: layout.padding_x2_5 }}
              />
              <GeneralSelect
                width={mediumWidth}
                data={certificationFromData}
                initValue="Certified From (Adobe)"
                value={certificationFrom}
                setValue={setCertificationFrom}
                style={{ marginRight: layout.padding_x2_5 }}
              />
              <GeneralSelect
                width={quaterWidth}
                data={yearData}
                initValue="Year"
                value={certificationYear}
                setValue={setCertificationYear}
                style={{ marginRight: layout.padding_x2_5 }}
              />
              <TertiaryButton
                size="M"
                text="Add"
                onPress={() => {
                  const certifications = seller.certifications;
                  if (
                    !certification ||
                    !certificationFrom ||
                    !certificationYear
                  )
                    return;
                  if (
                    !certifications.find((item) => item.name === certification)
                  ) {
                    certifications.push({
                      name: certification,
                      from: certificationFrom,
                      year: parseInt(certificationYear, 10),
                    } as CertificationInfo);
                    setSeller({ ...seller, certifications });
                  }
                }}
              />
            </View>
            <View style={{ flexDirection: "column" }}>
              {seller.certifications.map((value, index) => (
                <View
                  key={`certificationinfo-${index}`}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginTop: 16,
                  }}
                >
                  <BrandText
                    style={[
                      fontSemibold16,
                      { color: neutral77, paddingVertical: 5 },
                    ]}
                  >
                    {value.name} - {value.from}, {value.year}
                  </BrandText>
                  <TouchableOpacity
                    style={{
                      alignItems: "flex-start",
                      justifyContent: "center",
                      marginLeft: 10,
                    }}
                    onPress={() => {
                      const certifications = seller.certifications;
                      certifications.splice(index, 1);
                      setSeller({ ...seller, certifications });
                    }}
                  >
                    <SVG
                      source={trashSVG}
                      width={24}
                      height={24}
                      style={{ marginTop: 2 }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.itemContainer, { zIndex: 1 }]}>
          <BrandText style={styles.infoTitle}>Personal Site</BrandText>
          <View style={styles.itemContent}>
            <TextInput
              style={[styles.textInput, { outlineStyle: "none" } as any]}
              placeholder="Provide a link to your own website"
              placeholderTextColor={neutral77}
              value={seller.personalSite}
              onChangeText={(text: string) => {
                setSeller({ ...seller, personalSite: text } as SellerInfo);
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
