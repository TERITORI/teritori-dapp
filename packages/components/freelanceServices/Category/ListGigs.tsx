import React, { useState, useEffect } from "react";
import { TouchableOpacity, View } from "react-native";

import chevronLeftDouble from "../../../../assets/icons/chevron-left-double.svg";
import chevronLeft from "../../../../assets/icons/chevron-left.svg";
import chevronRightDouble from "../../../../assets/icons/chevron-right-double.svg";
import chevronRight from "../../../../assets/icons/chevron-right.svg";
import chevronUp from "../../../../assets/icons/chevron-up.svg";
import chevronDown from "../../../../assets/icons/freelance-service/chevron-down.svg";
import { useWallets } from "../../../context/WalletsProvider";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import { getGigData } from "../../../screens/FreelanceServices/query/data";
import { mustGetFreelanceClient } from "../../../utils/backend";
import { useAppNavigation } from "../../../utils/navigation";
import {
  neutral17,
  neutral22,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import {
  fontBold16,
  fontMedium14,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout, leftMarginMainContent } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryBox } from "../../boxes/TertiaryBox";
import { TextInputCustom } from "../../inputs/TextInputCustom";
import { ServiceCard } from "../Cards/ServiceCard";
import { GigData } from "../types/fields";

// const data = getServiceListing();
const logoDesignTags = [
  "retro",
  "styleguides",
  "minimalism",
  "logoanimation",
  "signature",
  "3dlogo",
  "vintage",
  "modern",
  "handdrawn",
  "vector",
  "studio",
  "futuristic",
  "crypto",
  "space",
  "abstract",
  "chrome",
  "glass",
  "fintech",
  "insurance",
  "geometric",
];

type ListGigsProps = {
  category: string;
  subcategory: string;
}
export const ListGigs: React.FC<ListGigsProps> = ({category, subcategory}) => {
  const [changePage, setChangePage] = useState("1");
  const [chooseItemsPerPage, setChooseItemsPerPage] = useState(false);
  const [numbersOfItemsPerPage] = useState(10);
  const [pageLimitMin, setPageLimitMin] = useState(0);
  const [pageLimitMax, setPageLimitMax] = useState(numbersOfItemsPerPage);
  const navigation = useAppNavigation();
  const { wallets } = useWallets();
  const [gigDataList, setGigDataList] = useState<GigData[]>([]);
  const networkId = useSelectedNetworkId();
  useEffect(() => {
    const getGigDataList = async () => {
      const freelanceClient = mustGetFreelanceClient(networkId);
      const res = await freelanceClient.GigList({ limit: 2, offset: 0 });
      const newGigDataList: GigData[] = [];
      res.gigs.map(async (gigInfo, index) => {
        newGigDataList.push(
          await getGigData(
            gigInfo.id,
            JSON.parse(gigInfo.gigData),
            gigInfo.address
          )
        );
      });
      setGigDataList(newGigDataList);
    };
    getGigDataList();
  }, [wallets, networkId]);
  function reducePageLimits() {
    setPageLimitMin(pageLimitMin - numbersOfItemsPerPage);
    setPageLimitMax(pageLimitMax - numbersOfItemsPerPage);
  }

  function addPageLimits() {
    setPageLimitMin(pageLimitMin + numbersOfItemsPerPage);
    setPageLimitMax(pageLimitMax + numbersOfItemsPerPage);
  }

  function checkIfLowerLimitIsReached() {
    return pageLimitMin === 0;
  }

  function checkIfMaxLimitIsReached() {
    return pageLimitMax >= gigDataList.length;
  }

  return (
    <>
      <View
        style={{
          alignSelf: "center",
          width: "100%",
          flexDirection: "row",
          flexWrap: "wrap",
          paddingHorizontal: leftMarginMainContent,
          zIndex: -1,
        }}
      >
        {gigDataList.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              navigation.navigate("FreelanceServicesGigDetail", {
                gigId: item.id,
              });
            }}
          >
            <ServiceCard
              key={index}
              width={306}
              height={336}
              gigData={item}
              boxStyle={{
                marginBottom: layout.padding_x2_5,
                marginRight: layout.padding_x1,
                marginLeft: layout.padding_x1,
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          paddingHorizontal: leftMarginMainContent,
          justifyContent: "space-between",
          alignSelf: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BrandText
            style={[{ color: neutral77, marginRight: 4 }, fontMedium14]}
          >
            Page 1 of 2 | Go to page:
          </BrandText>
          <TextInputCustom
            label=""
            name="minInput"
            value={changePage}
            onChangeText={setChangePage}
            width={60}
            height={30}
          />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            disabled={checkIfLowerLimitIsReached()}
            onPress={() => {
              if (pageLimitMax !== 0) {
                reducePageLimits();
              }
            }}
          >
            <TertiaryBox width={56} height={40}>
              <SVG source={chevronLeft} width={16} height={16} />
            </TertiaryBox>
          </TouchableOpacity>
          <TouchableOpacity>
            <TertiaryBox style={{ marginLeft: 12 }} width={56} height={40}>
              <SVG source={chevronLeftDouble} width={16} height={16} />
            </TertiaryBox>
          </TouchableOpacity>
          <TertiaryBox
            style={{ marginRight: 4, marginLeft: 12 }}
            mainContainerStyle={{ backgroundColor: primaryColor }}
            width={56}
            height={40}
          >
            <BrandText style={fontBold16}>1</BrandText>
          </TertiaryBox>
          <TertiaryBox
            style={{ marginRight: 12 }}
            mainContainerStyle={{ backgroundColor: neutral22 }}
            width={56}
            height={40}
          >
            <BrandText style={fontBold16}>2</BrandText>
          </TertiaryBox>
          <TouchableOpacity>
            <TertiaryBox style={{ marginRight: 8 }} width={56} height={40}>
              <SVG source={chevronRightDouble} width={16} height={16} />
            </TertiaryBox>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={checkIfMaxLimitIsReached()}
            onPress={() => {
              if (pageLimitMax < gigDataList.length) {
                addPageLimits();
              }
            }}
          >
            <TertiaryBox width={56} height={40}>
              <SVG source={chevronRight} width={16} height={16} />
            </TertiaryBox>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BrandText
            style={[{ color: neutral77, marginRight: 8 }, fontMedium14]}
          >
            Items per page:
          </BrandText>
          <TertiaryBox
            width={80}
            height={40}
            mainContainerStyle={{ backgroundColor: neutral22 }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <BrandText style={fontMedium14}>
                {numbersOfItemsPerPage}
              </BrandText>
              <TouchableOpacity
                onPress={() => setChooseItemsPerPage(!chooseItemsPerPage)}
              >
                {chooseItemsPerPage ? (
                  <SVG source={chevronDown} width={16} height={16} />
                ) : (
                  <SVG source={chevronUp} width={16} height={16} />
                )}
              </TouchableOpacity>
            </View>
          </TertiaryBox>
        </View>
      </View>
      <BrandText
        style={[fontSemibold20, { alignSelf: "center", marginTop: 50 }]}
      >
        Explore More Logo Design Tags
      </BrandText>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        {logoDesignTags.map((item, index) => (
          <TertiaryBox
            key={index}
            noBrokenCorners
            mainContainerStyle={{ backgroundColor: neutral17 }}
            style={{ marginLeft: 8, marginBottom: 8 }}
          >
            <BrandText
              style={[
                fontMedium14,
                {
                  paddingBottom: layout.padding_x1_5,
                  paddingTop: layout.padding_x1_5,
                  paddingLeft: layout.padding_x2,
                  paddingRight: layout.padding_x2,
                },
              ]}
              key={index}
            >
              {item}
            </BrandText>
          </TertiaryBox>
        ))}
      </View>
    </>
  );
};
