import React, { useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import {
  Bars2Icon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
} from "react-native-heroicons/outline";

import avaPNG from "../../../assets/default-images/ava.png";
import guardianPng from "../../../assets/default-images/guardian_1.png";
import { BrandText } from "../../components/BrandText";
import { Box } from "../../components/boxes/Box";
import { SearchInput } from "../../components/sorts/SearchInput";
import {
  neutralA3,
  neutral17,
  primaryColor,
  neutral33,
  neutral00,
  gradientColorLightBlue,
} from "../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
} from "../../utils/style/fonts";

const MD_BREAKPOINT = 820;

type Props = {
  setIsEditHighlighted: (val: boolean) => void;
};

export const CurrentlyHighLightedProject = ({
  setIsEditHighlighted,
}: Props) => {
  const { width } = useWindowDimensions();

  const [guardiansHandler, setGuardiansHandler] = useState<any>([]);
  const [isListOpen, setIsListOpen] = useState<any>();

  return (
    <View style={{ marginVertical: 32 }}>
      <TouchableOpacity
        onPress={() => setIsEditHighlighted(false)}
        style={{ alignSelf: "flex-start" }}
      >
        <Box notched style={styles.boxBtn}>
          <CheckCircleIcon width={20} height={20} />
          <BrandText
            style={[fontSemibold13, { color: neutral17, marginLeft: 5 }]}
          >
            Save changes
          </BrandText>
        </Box>
      </TouchableOpacity>
      <View style={styles.marginVertical24}>
        <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
          Select the desired collections to display and drag them in the desired
          order.
        </BrandText>
      </View>
      <View style={[{ flex: 1 }, styles.marginVertical24]}>
        <View
          style={{ flexDirection: width >= MD_BREAKPOINT ? "row" : "column" }}
        >
          {guardiansHandler?.map((d: any, i: any) => {
            return (
              <>
                <View
                  style={[
                    styles.viewBox,
                    { width: width >= MD_BREAKPOINT ? "19%" : "100%" },
                  ]}
                >
                  <View style={styles.insideBoxMap}>
                    <View style={styles.dotBackground}>
                      <BrandText style={[fontSemibold14]}>{i + 1}</BrandText>
                    </View>
                    <View>
                      <Bars2Icon color="white" />
                    </View>
                  </View>
                  <Box notched style={styles.herosLisBox}>
                    <TouchableOpacity
                      onPress={() =>
                        setIsListOpen((o: any) => (o === i ? null : i))
                      }
                      style={styles.toggleBox}
                    >
                      <BrandText style={[fontSemibold14]}>
                        Genesis Guardians
                      </BrandText>
                      <View>
                        {isListOpen === i ? (
                          <ChevronDownIcon
                            color="white"
                            height={20}
                            width={20}
                          />
                        ) : (
                          <ChevronUpIcon color="white" height={20} width={20} />
                        )}
                      </View>
                    </TouchableOpacity>
                    {isListOpen === i ? (
                      <Box notched style={styles.toggleDetailStyle}>
                        <View style={{ margin: 10 }}>
                          <SearchInput handleChangeText={() => {}} />
                          <FlatList
                            showsVerticalScrollIndicator={false}
                            data={Array(10).fill(0)}
                            renderItem={({ item }) => (
                              <View style={styles.listToggle}>
                                <Image
                                  style={{
                                    width: 28,
                                    height: 28,
                                  }}
                                  source={avaPNG}
                                />
                                <BrandText
                                  style={[
                                    fontSemibold16,
                                    { marginLeft: 15, marginRight: 10 },
                                  ]}
                                >
                                  Meebits
                                </BrandText>
                                <CheckBadgeIcon color={primaryColor} />
                              </View>
                            )}
                            keyExtractor={(item: any) => item.id}
                            style={{
                              marginTop: 12,
                              marginLeft: 5,
                            }}
                            contentContainerStyle={{
                              height: 180,
                            }}
                          />
                        </View>
                      </Box>
                    ) : (
                      <ImageBackground
                        source={guardianPng}
                        imageStyle={{ borderRadius: 16 }}
                        style={styles.imageBgStyle}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            const old = [...guardiansHandler];
                            old.splice(i, 1);
                            setGuardiansHandler(old);
                          }}
                          style={styles.trashBtnBox}
                        >
                          <TrashIcon color="white" height={22} width={22} />
                        </TouchableOpacity>
                      </ImageBackground>
                    )}
                  </Box>
                </View>
              </>
            );
          })}
          {guardiansHandler?.length < 5 ? (
            <Box
              notched
              style={[
                styles.herosLisBox,
                {
                  width: width >= MD_BREAKPOINT ? "19%" : "100%",
                  marginTop: 52,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => setGuardiansHandler([...guardiansHandler, 1])}
                style={styles.plusBox}
              >
                <View style={styles.dotBackground}>
                  <PlusIcon color="white" />
                </View>
                <BrandText style={[fontSemibold14, { marginLeft: 5 }]}>
                  Add more
                </BrandText>
              </TouchableOpacity>
            </Box>
          ) : null}
        </View>
      </View>
    </View>
  );
};

// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  boxBtn: {
    flexDirection: "row",
    alignSelf: "flex-start",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: primaryColor,
    marginTop: 24,
  },
  dotBackground: {
    backgroundColor: neutral33,
    height: 35,
    width: 35,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  trashBtnBox: {
    backgroundColor: neutral00,
    height: 35,
    width: 35,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 16,
    bottom: 10,
  },
  marginVertical24: {
    marginVertical: 24,
  },
  insideBoxMap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
  },
  toggleBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewBox: {
    width: "19%",
    marginHorizontal: 8,
  },
  herosLisBox: {
    borderWidth: 1,
    borderColor: neutral33,
    padding: 12,
    marginTop: 12,
    height: 325,
  },
  plusBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  imageBgStyle: {
    alignItems: "center",
    justifyContent: "center",
    height: 250,
    width: "100%",
  },
  toggleDetailStyle: {
    height: 250,
    width: "100%",
    borderWidth: 1,
    borderColor: gradientColorLightBlue,
  },
  toggleBoxInside: {},
  listToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
});
