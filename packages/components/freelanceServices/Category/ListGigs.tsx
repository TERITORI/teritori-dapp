import React, { useState, useEffect } from "react";
import { TouchableOpacity, View } from "react-native";

import chevronLeftDouble from "../../../../assets/icons/chevron-left-double.svg";
// import chevronLeft from "../../../../assets/icons/chevron-left.svg";
import chevronRightDouble from "../../../../assets/icons/chevron-right-double.svg";
// import chevronRight from "../../../../assets/icons/chevron-right.svg";
import chevronUp from "../../../../assets/icons/chevron-up.svg";
import chevronDown from "../../../../assets/icons/freelance-service/chevron-down.svg";
import { useFetchGigs } from "../../../hooks/freelance/useFetchGigs";
import { usePagination } from "../../../hooks/freelance/usePagination";
import { getGigData } from "../../../screens/FreelanceServices/query/data";
import { useAppNavigation } from "../../../utils/navigation";
import {
  // neutral17,
  neutral22,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import { fontBold16, fontMedium14 } from "../../../utils/style/fonts";
import { layout, leftMarginMainContent } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryBox } from "../../boxes/TertiaryBox";
import { TextInputCustom } from "../../inputs/TextInputCustom";
import { ServiceCard } from "../Cards/ServiceCard";
import { GigData } from "../types/fields";

// const data = getServiceListing();
// const logoDesignTags = [
//   "retro",
//   "styleguides",
//   "minimalism",
//   "logoanimation",
//   "signature",
//   "3dlogo",
//   "vintage",
//   "modern",
//   "handdrawn",
//   "vector",
//   "studio",
//   "futuristic",
//   "crypto",
//   "space",
//   "abstract",
//   "chrome",
//   "glass",
//   "fintech",
//   "insurance",
//   "geometric",
// ];

type ListGigsProps = {
  category: string;
  subcategory: string;
};
export const ListGigs: React.FC<ListGigsProps> = ({
  category,
  subcategory,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [chooseItemsPerPage, setChooseItemsPerPage] = useState(false);
  const [numbersOfItemsPerPage] = useState(10);
  const navigation = useAppNavigation();
  const [gigDataList, setGigDataList] = useState<GigData[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const { data: gigs } = useFetchGigs({
    category,
    subcategory,
    limit: 10,
    offset: 10 * pageNum,
  });
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount: 1,
    pageSize: numbersOfItemsPerPage,
  });

  const onNext = () => {
    setCurrentPage(currentPage + 1);
  };
  const onPrevious = () => {
    setCurrentPage(currentPage - 1);
  };
  const lastPage = paginationRange
    ? paginationRange[paginationRange.length - 1]
    : 1;

  useEffect(() => {
    const newGigDataList: GigData[] = [];
    const getGigDataList = async () => {
      if (!gigs) return;
      setTotalCount(gigs.totalCount);
      gigs.list.map(async (gigInfo) => {
        newGigDataList.push(
          await getGigData(
            gigInfo.identifier,
            JSON.parse(gigInfo.metadata),
            gigInfo.createdBy
          )
        );
      });
      setGigDataList(newGigDataList);
    };
    getGigDataList();
  }, [gigs]);

  const handleChangePageNum = (pageNum: string) => {
    const nPageNum = parseInt(pageNum, 10);
    if (isNaN(nPageNum) || nPageNum === 0) {
      setPageNum(1);
    }
  };

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
            Page 1 of {Math.floor(totalCount / numbersOfItemsPerPage) + 1} | Go
            to page:
          </BrandText>
          <TextInputCustom
            label=""
            name="minInput"
            value={pageNum.toString()}
            onChangeText={handleChangePageNum}
            width={60}
            height={30}
          />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
          {/* <TouchableOpacity>
            <TertiaryBox style={{ marginLeft: 12 }} width={56} height={40}>
              <SVG source={chevronLeftDouble} width={16} height={16} />
            </TertiaryBox>
          </TouchableOpacity> */}
          {currentPage !== 1 && (
            <TouchableOpacity onPress={onPrevious}>
              <TertiaryBox style={{ marginLeft: 12 }} width={56} height={40}>
                <SVG source={chevronLeftDouble} width={16} height={16} />
              </TertiaryBox>
            </TouchableOpacity>
          )}
          {paginationRange &&
            paginationRange.map((page) => {
              return (
                <>
                  {page === "..." && (
                    <TertiaryBox
                      style={{ marginRight: 4, marginLeft: 12 }}
                      mainContainerStyle={{ backgroundColor: primaryColor }}
                      width={56}
                      height={40}
                    >
                      <BrandText style={fontBold16}>...</BrandText>
                    </TertiaryBox>
                  )}
                  {page !== "..." && (
                    <TertiaryBox
                      style={{ marginRight: 4, marginLeft: 12 }}
                      mainContainerStyle={{ backgroundColor: primaryColor }}
                      width={56}
                      height={40}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setCurrentPage(page as number);
                        }}
                      >
                        <BrandText style={fontBold16}>{page}</BrandText>
                      </TouchableOpacity>
                    </TertiaryBox>
                  )}
                </>
              );
            })}
          {currentPage !== lastPage && (
            <TouchableOpacity onPress={onNext}>
              <TertiaryBox style={{ marginLeft: 12 }} width={56} height={40}>
                <SVG source={chevronRightDouble} width={16} height={16} />
              </TertiaryBox>
            </TouchableOpacity>
          )}

          {/* <TouchableOpacity>
            <TertiaryBox style={{ marginRight: 8 }} width={56} height={40}>
              <SVG source={chevronRightDouble} width={16} height={16} />
            </TertiaryBox>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
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
      {/* <BrandText
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
      > */}
      {/* {logoDesignTags.map((item, index) => (
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
        ))} */}
      {/* </View> */}
    </>
  );
};
