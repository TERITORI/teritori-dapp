import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";

import { listExtraDeliveryTime } from "./GigBasedata";
import { GigCreationPricingTable } from "./GigCreationPricingTable";
import {
  ExtraFast,
  GigInfo,
} from "../../../screens/FreelanceServices/types/fields";
import {
  neutral77,
  neutralA3,
  neutral33,
  secondaryColor,
  neutral00,
  neutral22,
} from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { CheckBox } from "../../checkbox/CheckBox";
import { GeneralSelect } from "../../select/GeneralSelect";

const pageContentWidth = 908;

export const GigCreationPricing: React.FC<{
  gigInfo: GigInfo;
  setGig: React.Dispatch<React.SetStateAction<GigInfo>>;
}> = ({ gigInfo, setGig }) => {
  const inputWidth = 196;

  const [visibleExtraFastDelivery, setVisibleExtraFastDelivery] =
    useState<boolean>(
      gigInfo.extraFastBasic.expectedDuration !== "" ||
        gigInfo.extraFastStandard.expectedDuration !== "" ||
        gigInfo.extraFastPremium.expectedDuration !== ""
    );
  const [visibleAdditionalPage, setVisibleAdditionalPage] = useState<boolean>(
    gigInfo.additionalPage !== null &&
      gigInfo.additionalPage.expectedDuration !== ""
  );
  const [visibleResponsiveDesign, setVisibleResponsiveDesign] =
    useState<boolean>(
      gigInfo.responsiveDesign !== null &&
        gigInfo.responsiveDesign.expectedDuration !== ""
    );
  const [visibleIncludeSourceCode, setVisibleIncludeSourceCode] =
    useState<boolean>(gigInfo.includeSourceCode !== null);
  const [visibleAdditionalRevision, setVisibleAdditionalRevision] =
    useState<boolean>(
      gigInfo.additionalRevision !== null &&
        gigInfo.additionalRevision.expectedDuration !== ""
    );

  return (
    <View style={styles.pageContent}>
      <BrandText>Packages</BrandText>
      <GigCreationPricingTable gigInfo={gigInfo} setGig={setGig} />
      <BrandText style={{ marginVertical: layout.padding_x4 }}>
        Add extra services
      </BrandText>
      <View style={styles.oneLine}>
        <View style={styles.rowContainer}>
          <CheckBox
            zoom={1.5}
            value={visibleExtraFastDelivery}
            onValueChange={() => {
              if (visibleExtraFastDelivery) {
                let extra = false;
                if (
                  gigInfo.extraFastBasic.expectedDuration !== "" ||
                  gigInfo.extraFastStandard.expectedDuration !== "" ||
                  gigInfo.extraFastPremium.expectedDuration !== ""
                ) {
                  extra = true;
                }
                setVisibleExtraFastDelivery(extra);
              } else {
                setVisibleExtraFastDelivery(true);
              }
            }}
          />
          <BrandText style={[fontSemibold14]}>Extra fast delivery</BrandText>
        </View>
      </View>
      {visibleExtraFastDelivery && (
        <>
          <View style={[styles.oneLine, { zIndex: 10 }]}>
            <BrandText style={styles.text}>Basic</BrandText>
            <View style={styles.rowContainer}>
              <BrandText style={styles.text}>I'll deliver in only</BrandText>
              <GeneralSelect
                data={listExtraDeliveryTime}
                width={inputWidth}
                value={gigInfo.extraFastBasic.expectedDuration}
                setValue={(v: string) => {
                  setGig({
                    ...gigInfo,
                    extraFastBasic: {
                      ...gigInfo.extraFastBasic,
                      expectedDuration: v,
                    },
                  });
                }}
                initValue="Select"
              />
              <BrandText style={styles.text}>for an extra</BrandText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.inputBox, { outlineStyle: "none" } as any]}
                  placeholder="0"
                  value={gigInfo.extraFastBasic.price}
                  onChangeText={(v) => {
                    setGig({
                      ...gigInfo,
                      extraFastBasic: { ...gigInfo.extraFastBasic, price: v },
                    });
                  }}
                />
                <BrandText style={styles.inputText}>$</BrandText>
              </View>
            </View>
          </View>
          <View style={[styles.oneLine, { zIndex: 9 }]}>
            <BrandText style={styles.text}>Standard</BrandText>
            <View style={styles.rowContainer}>
              <BrandText style={styles.text}>I'll deliver in only</BrandText>
              <GeneralSelect
                data={listExtraDeliveryTime}
                width={inputWidth}
                value={gigInfo.extraFastStandard.expectedDuration}
                setValue={(v: string) => {
                  setGig({
                    ...gigInfo,
                    extraFastStandard: {
                      ...gigInfo.extraFastStandard,
                      expectedDuration: v,
                    },
                  });
                }}
                initValue="Select"
              />
              <BrandText style={styles.text}>for an extra</BrandText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.inputBox, { outlineStyle: "none" } as any]}
                  placeholder="0"
                  value={gigInfo.extraFastStandard.price}
                  onChangeText={(v) => {
                    setGig({
                      ...gigInfo,
                      extraFastStandard: {
                        ...gigInfo.extraFastStandard,
                        price: v,
                      },
                    });
                  }}
                />
                <BrandText style={styles.inputText}>$</BrandText>
              </View>
            </View>
          </View>
          <View style={[styles.oneLine, { zIndex: 8 }]}>
            <BrandText style={styles.text}>Premium</BrandText>
            <View style={styles.rowContainer}>
              <BrandText style={styles.text}>I'll deliver in only</BrandText>
              <GeneralSelect
                data={listExtraDeliveryTime}
                width={inputWidth}
                value={gigInfo.extraFastPremium.expectedDuration}
                setValue={(v: string) => {
                  setGig({
                    ...gigInfo,
                    extraFastPremium: {
                      ...gigInfo.extraFastPremium,
                      expectedDuration: v,
                    },
                  });
                }}
                initValue="Select"
              />
              <BrandText style={styles.text}>for an extra</BrandText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.inputBox, { outlineStyle: "none" } as any]}
                  placeholder="0"
                  value={gigInfo.extraFastPremium.price}
                  onChangeText={(v) => {
                    setGig({
                      ...gigInfo,
                      extraFastPremium: {
                        ...gigInfo.extraFastPremium,
                        price: v,
                      },
                    });
                  }}
                />
                <BrandText style={styles.inputText}>$</BrandText>
              </View>
            </View>
          </View>
        </>
      )}
      <View style={styles.divideLine} />
      <View style={[styles.oneLine, { zIndex: 7 }]}>
        <View style={styles.rowContainer}>
          <CheckBox
            zoom={1.5}
            value={visibleAdditionalPage}
            onValueChange={() => {
              if (visibleAdditionalPage) {
                setGig({ ...gigInfo, additionalPage: null });
              }
              setVisibleAdditionalPage(!visibleAdditionalPage);
            }}
          />
          <BrandText style={[fontSemibold14]}>Additional pages</BrandText>
        </View>
        {visibleAdditionalPage && (
          <View style={styles.rowContainer}>
            <BrandText style={styles.text}>for an extra</BrandText>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.inputBox, { outlineStyle: "none" } as any]}
                placeholder="0"
                value={
                  gigInfo.additionalPage !== null
                    ? gigInfo.additionalPage.price
                    : ""
                }
                onChangeText={(v) => {
                  const additionalPage: ExtraFast = {
                    expectedDuration:
                      gigInfo.additionalPage !== null
                        ? gigInfo.additionalPage.expectedDuration
                        : "",
                    price: v,
                  };
                  setGig({ ...gigInfo, additionalPage });
                }}
              />
              <BrandText style={styles.inputText}>$</BrandText>
            </View>
            <BrandText style={styles.text}>and additional</BrandText>
            <GeneralSelect
              data={listExtraDeliveryTime}
              width={inputWidth}
              value={
                gigInfo.additionalPage !== null
                  ? gigInfo.additionalPage.expectedDuration
                  : ""
              }
              setValue={(v: string) => {
                const additionalPage: ExtraFast = {
                  expectedDuration: v,
                  price:
                    gigInfo.additionalPage !== null
                      ? gigInfo.additionalPage.price
                      : "0",
                };
                setGig({ ...gigInfo, additionalPage });
              }}
              initValue="Select"
            />
          </View>
        )}
      </View>
      <View style={styles.divideLine} />
      <View style={[styles.oneLine, { zIndex: 6 }]}>
        <View style={styles.rowContainer}>
          <CheckBox
            zoom={1.5}
            value={visibleResponsiveDesign}
            onValueChange={() => {
              if (visibleResponsiveDesign) {
                setGig({ ...gigInfo, responsiveDesign: null });
              }
              setVisibleResponsiveDesign(!visibleResponsiveDesign);
            }}
          />
          <BrandText style={[fontSemibold14]}>Responsive design</BrandText>
        </View>
        {visibleResponsiveDesign && (
          <View style={styles.rowContainer}>
            <BrandText style={styles.text}>for an extra</BrandText>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.inputBox, { outlineStyle: "none" } as any]}
                placeholder="0"
                value={
                  gigInfo.responsiveDesign !== null
                    ? gigInfo.responsiveDesign.price
                    : ""
                }
                onChangeText={(v) => {
                  const responsiveDesign: ExtraFast = {
                    expectedDuration:
                      gigInfo.responsiveDesign !== null
                        ? gigInfo.responsiveDesign.expectedDuration
                        : "",
                    price: v,
                  };
                  setGig({ ...gigInfo, responsiveDesign });
                }}
              />
              <BrandText style={styles.inputText}>$</BrandText>
            </View>
            <BrandText style={styles.text}>and additional</BrandText>
            <GeneralSelect
              data={listExtraDeliveryTime}
              width={inputWidth}
              value={
                gigInfo.responsiveDesign !== null
                  ? gigInfo.responsiveDesign.expectedDuration
                  : ""
              }
              setValue={(v: string) => {
                const responsiveDesign: ExtraFast = {
                  expectedDuration: v,
                  price:
                    gigInfo.responsiveDesign !== null
                      ? gigInfo.responsiveDesign.price
                      : "0",
                };
                setGig({ ...gigInfo, responsiveDesign });
              }}
              initValue="Select"
            />
          </View>
        )}
      </View>
      <View style={styles.divideLine} />
      <View style={[styles.oneLine, { zIndex: 5 }]}>
        <View style={styles.rowContainer}>
          <CheckBox
            zoom={1.5}
            value={visibleIncludeSourceCode}
            onValueChange={() => {
              if (visibleIncludeSourceCode) {
                setGig({ ...gigInfo, includeSourceCode: null });
              }
              setVisibleIncludeSourceCode(!visibleIncludeSourceCode);
            }}
          />
          <BrandText style={[fontSemibold14]}>Include source code</BrandText>
        </View>
        {visibleIncludeSourceCode && (
          <View style={styles.rowContainer}>
            <BrandText style={styles.text}>for an extra</BrandText>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.inputBox, { outlineStyle: "none" } as any]}
                placeholder="0"
                value={
                  gigInfo.includeSourceCode !== null
                    ? gigInfo.includeSourceCode
                    : ""
                }
                onChangeText={(v) => {
                  setGig({ ...gigInfo, includeSourceCode: v });
                }}
              />
              <BrandText style={styles.inputText}>$</BrandText>
            </View>
          </View>
        )}
      </View>
      <View style={styles.divideLine} />
      <View style={[styles.oneLine, { zIndex: 4 }]}>
        <View style={styles.rowContainer}>
          <CheckBox
            zoom={1.5}
            value={visibleAdditionalRevision}
            onValueChange={() => {
              if (visibleAdditionalRevision) {
                setGig({ ...gigInfo, additionalRevision: null });
              }
              setVisibleAdditionalRevision(!visibleAdditionalRevision);
            }}
          />
          <BrandText style={[fontSemibold14]}>Additional Revision</BrandText>
        </View>
        {visibleAdditionalRevision && (
          <View style={styles.rowContainer}>
            <BrandText style={styles.text}>for an extra</BrandText>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.inputBox, { outlineStyle: "none" } as any]}
                placeholder="0"
                value={
                  gigInfo.additionalRevision !== null
                    ? gigInfo.additionalRevision.price
                    : ""
                }
                onChangeText={(v) => {
                  const additionalRevision: ExtraFast = {
                    expectedDuration:
                      gigInfo.additionalRevision !== null
                        ? gigInfo.additionalRevision.expectedDuration
                        : "",
                    price: v,
                  };
                  setGig({ ...gigInfo, additionalRevision });
                }}
              />
              <BrandText style={styles.inputText}>$</BrandText>
            </View>
            <BrandText style={styles.text}>and additional</BrandText>
            <GeneralSelect
              data={listExtraDeliveryTime}
              width={inputWidth}
              value={
                gigInfo.additionalRevision !== null
                  ? gigInfo.additionalRevision.expectedDuration
                  : ""
              }
              setValue={(v: string) => {
                const additionalRevision: ExtraFast = {
                  expectedDuration: v,
                  price:
                    gigInfo.additionalRevision !== null
                      ? gigInfo.additionalRevision.price
                      : "0",
                };
                setGig({ ...gigInfo, additionalRevision });
              }}
              initValue="Select"
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContent: {
    flexDirection: "column",
    width: pageContentWidth,
  },
  text: StyleSheet.flatten([
    fontSemibold13,
    {
      color: neutralA3,
    },
  ]),
  rowContainer: {
    flexDirection: "row",
    gap: layout.padding_x1_5,
    alignItems: "center",
  },
  oneLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: layout.padding_x1_5,
    height: 48,
  },
  divideLine: {
    width: "100%",
    height: 1,
    backgroundColor: neutral22,
    marginVertical: layout.padding_x1_5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: layout.padding_x1,
    backgroundColor: neutral00,
    borderWidth: 1,
    borderColor: neutral33,
    padding: layout.padding_x2,
    borderRadius: layout.padding_x1_5,
  },
  inputBox: StyleSheet.flatten([
    fontSemibold14,
    {
      backgroundColor: neutral00,
      borderWidth: 0,
      color: secondaryColor,
    },
  ]),
  inputText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutral77,
    },
  ]),
});
