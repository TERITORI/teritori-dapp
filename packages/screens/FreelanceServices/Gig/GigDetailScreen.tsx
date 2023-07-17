import React, { useState, useEffect } from "react";
import {
  Image,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { OrdersInQueue } from "./OrdersInQueue";
import backgroundPic from "../../../../assets/banners/freelance-service/background-pic.png";
import chevronUp from "../../../../assets/icons/chevron-up.svg";
import chevronDown from "../../../../assets/icons/freelance-service/chevron-down.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { ReviewCard } from "../../../components/freelanceServices/Cards/ReviewCard";
// import { DisplayMoreServices } from "../../../components/freelanceServices/LogoDesign/LogoDesignDetails/DisplayMoreServices";
import { DisplayReviews } from "../../../components/freelanceServices/Gig/DisplayReviews";
import { GigDetailHeader } from "../../../components/freelanceServices/Gig/GigDetailHeader";
import { ServicesCard } from "../../../components/freelanceServices/Gig/ServicesCard";
import { LogoDesignDetailsTab } from "../../../components/freelanceServices/LogoDesign/LogoDesignDetails/LogoDesignDetailsTab";
import { RelatedTags } from "../../../components/freelanceServices/LogoDesign/LogoDesignDetails/RelatedTags";
import { ReviewsStats } from "../../../components/freelanceServices/LogoDesign/LogoDesignDetails/ReviewsStats";
import { StarRating } from "../../../components/freelanceServices/common/StarRating";
import { PortfolioImage } from "../../../components/inputs/PortfolioImage";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import { mustGetFreelanceClient } from "../../../utils/backend";
import { ipfsPinataUrl } from "../../../utils/ipfs";
import { ScreenFC, useAppNavigation } from "../../../utils/navigation";
import {
  neutral00,
  neutral33,
  neutral44,
  neutral77,
  neutralA3,
  successColor,
  yellowDefault,
} from "../../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
  fontSemibold28,
} from "../../../utils/style/fonts";
import { leftMarginMainContent } from "../../../utils/style/layout";
import { FreelanceServicesScreenWrapper } from "../FreelanceServicesScreenWrapper";
import { TopRatedSeller } from "../SellersDetails/components/TopRatedSeller";
import { getGigData } from "../query/data";
import { GigInfo, GigData } from "../types/fields";

export const GigDetailScreen: ScreenFC<"FreelanceServicesGigDetail"> = ({
  route: {
    params: { gigId },
  },
}) => {
  const navigation = useAppNavigation();
  const [gigData, setGigData] = useState<GigData | null>(null);
  const { width } = useWindowDimensions();
  const networkId = useSelectedNetworkId();
  useEffect(() => {
    const setId = async () => {
      try {
        const freelanceClient = mustGetFreelanceClient(networkId);
        const res = await freelanceClient.GigData({ id: gigId });

        if (res.gig) {
          setGigData(
            await getGigData(
              gigId,
              JSON.parse(res.gig.gigData) as GigInfo,
              res.gig.address
            )
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
    setId();
  }, [gigId, networkId]);

  return (
    gigData && (
      <FreelanceServicesScreenWrapper>
        <View
          style={{
            flexDirection: "column",
            width: "100%",
            minHeight: 1075,
            alignSelf: "center",
            paddingHorizontal: leftMarginMainContent,
          }}
        >
          <GigDetailHeader data={gigData} />

          <View
            style={{
              flexDirection: width < 1440 ? "column" : "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ width: width < 1440 ? "100%" : "66%", marginTop: 24 }}
            >
              <BrandText style={fontSemibold28}>{gigData.title}</BrandText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                <Image
                  // @ts-ignore
                  source={ipfsPinataUrl(gigData.sellerUser.profilePic)}
                  style={{ width: 32, height: 32, marginRight: 12 }}
                />
                <BrandText style={[fontMedium14, { marginRight: 12 }]}>
                  @{gigData.sellerUser.username}
                </BrandText>
                <TopRatedSeller rating={gigData.sellerUser.rating} />
                <View
                  style={{
                    width: 24,
                    borderColor: neutral33,
                    borderWidth: 0.5,
                    transform: [{ rotate: "90deg" }],
                  }}
                />
                <StarRating rating={gigData.sellerUser.rating} />
                <BrandText
                  style={[
                    { color: yellowDefault, marginRight: 12 },
                    fontMedium14,
                  ]}
                >
                  {gigData.sellerUser.rating}
                </BrandText>
                <BrandText style={[{ color: neutral77 }, fontMedium14]}>
                  ({gigData.sellerUser.totalReviews})
                </BrandText>
                {gigData.sellerUser.totalQueue > 0 ? (
                  <View
                    style={{
                      width: 24,
                      borderColor: neutral33,
                      borderWidth: 0.5,
                      transform: [{ rotate: "90deg" }],
                    }}
                  />
                ) : null}
                <OrdersInQueue totalQueue={gigData.sellerUser.totalQueue} />
              </View>
              <Separator
                style={{ width: "100%", marginTop: 20, marginBottom: 16 }}
              />
              <TertiaryBox width={626} height={626}>
                <ImageBackground
                  source={backgroundPic}
                  style={{ width: "100%", height: "100%" }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      alignItems: "flex-end",
                    }}
                  >
                    <TouchableOpacity>
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          backgroundColor: neutral00,
                          borderColor: neutral33,
                          borderWidth: 0.5,
                          borderRadius: 24,
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 12,
                          marginRight: 16,
                        }}
                      >
                        <SVG
                          source={chevronUp}
                          width={16}
                          height={16}
                          style={{}}
                        />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          backgroundColor: neutral00,
                          borderColor: neutral33,
                          borderWidth: 0.5,
                          borderRadius: 24,
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 16,
                        }}
                      >
                        <SVG source={chevronDown} width={16} height={16} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </TertiaryBox>
              {gigData.reviews && gigData.reviews.items ? (
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 40,
                    alignItems: "center",
                  }}
                >
                  <BrandText style={fontSemibold20}>
                    What people loved about the seller
                  </BrandText>

                  <SecondaryButton size="SM" text="See all reviews" />
                </View>
              ) : (
                <></>
              )}

              {gigData.reviews && gigData.reviews.items ? (
                <ReviewCard reviews={gigData.reviews.items} />
              ) : (
                <></>
              )}

              <View nativeID="about" style={{ marginTop: 40, width: "100%" }}>
                <BrandText style={fontSemibold20}>About This Gig</BrandText>
                <BrandText
                  style={[
                    fontSemibold16,
                    { marginTop: 12, marginBottom: 12, color: neutral77 },
                  ]}
                >
                  {gigData.description}
                </BrandText>
              </View>

              <Separator
                style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
              />

              <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "column", width: 200 }}>
                  <BrandText
                    style={[
                      fontSemibold14,
                      { color: neutral77, marginBottom: 8 },
                    ]}
                  >
                    Logo Style
                  </BrandText>

                  <BrandText style={fontSemibold14}>Minimalist</BrandText>
                </View>
                <View style={{ flexDirection: "column", width: 500 }}>
                  <BrandText
                    style={[
                      fontSemibold14,
                      { color: neutral77, marginBottom: 8 },
                    ]}
                  >
                    File Format
                  </BrandText>

                  <BrandText style={fontSemibold14}>
                    AI, JPG, PDF, PNG, PSD, EPS, SVG
                  </BrandText>
                </View>
              </View>

              <View style={{ marginTop: 40 }}>
                <BrandText style={[fontSemibold20, { marginBottom: 16 }]}>
                  About the Seller
                </BrandText>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      // @ts-ignore
                      source={ipfsPinataUrl(gigData.sellerUser.profilePic)}
                      style={{ width: 104, height: 104 }}
                    />
                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "space-around",
                        marginLeft: 12,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate(
                              "FreelanceServicesSellerDetails",
                              {
                                address: gigData.sellerAddress,
                              }
                            );
                          }}
                        >
                          <BrandText style={fontSemibold16}>
                            {gigData.sellerUser.username}
                          </BrandText>
                        </TouchableOpacity>
                        <View
                          style={{
                            width: "fit-content",
                            height: "fit-content",
                            backgroundColor: neutral00,
                            borderColor: neutral44,
                            borderWidth: 0.5,
                            borderRadius: 24,
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: 12,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              paddingRight: 16,
                              paddingBottom: 8,
                              paddingLeft: 16,
                              paddingTop: 8,
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: successColor,
                                width: 6,
                                height: 6,
                                borderRadius: 24,
                              }}
                            />
                            <BrandText
                              style={[
                                fontSemibold16,
                                { color: successColor, marginLeft: 4 },
                              ]}
                            >
                              {" "}
                              {gigData.sellerUser.onlineStatus}
                            </BrandText>
                          </View>
                        </View>
                      </View>
                      <BrandText style={[fontMedium14, { color: neutralA3 }]}>
                        {gigData.sellerUser.tagline}
                      </BrandText>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginRight: 12,
                        }}
                      >
                        <StarRating rating={gigData.sellerUser.rating} />

                        <BrandText
                          style={[
                            { color: yellowDefault, marginRight: 12 },
                            fontMedium14,
                          ]}
                        >
                          {gigData.sellerUser.rating}
                        </BrandText>
                        <BrandText style={[{ color: neutral77 }, fontMedium14]}>
                          ({gigData.sellerUser.totalReviews})
                        </BrandText>
                      </View>
                    </View>
                  </View>
                  <SecondaryButton size="SM" text="Contact Me" />
                </View>

                <View style={{ flexDirection: "row", marginTop: 24 }}>
                  <View style={{ flexDirection: "column", width: 200 }}>
                    <BrandText
                      style={[
                        fontSemibold14,
                        { color: neutral77, marginBottom: 8 },
                      ]}
                    >
                      From
                    </BrandText>
                    <BrandText style={fontSemibold14}>
                      {gigData.sellerUser.country.name}
                    </BrandText>
                  </View>
                  <View style={{ flexDirection: "column", width: 500 }}>
                    <BrandText
                      style={[
                        fontSemibold14,
                        { color: neutral77, marginBottom: 8 },
                      ]}
                    >
                      Member Since
                    </BrandText>
                    <BrandText style={fontSemibold14}>
                      {`${gigData.sellerUser.createDate.toLocaleDateString()}`}
                    </BrandText>
                  </View>
                </View>
                <View style={{ flexDirection: "row", marginTop: 8 }}>
                  <View style={{ flexDirection: "column", width: 200 }}>
                    <BrandText
                      style={[
                        fontSemibold14,
                        { color: neutral77, marginBottom: 8 },
                      ]}
                    >
                      Avg. response time
                    </BrandText>
                    <BrandText style={fontSemibold14}>
                      {gigData.sellerUser.times.avgResponseTime}
                    </BrandText>
                  </View>
                  <View style={{ flexDirection: "column", width: 500 }}>
                    <BrandText
                      style={[
                        fontSemibold14,
                        { color: neutral77, marginBottom: 8 },
                      ]}
                    >
                      Last delivery
                    </BrandText>
                    <BrandText style={fontSemibold14}>
                      {gigData.sellerUser.times.lastDelivery}
                    </BrandText>
                  </View>
                </View>
              </View>

              <Separator
                style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
              />

              <BrandText
                style={[fontSemibold16, { color: neutral77, width: "100%" }]}
              >
                {gigData.sellerUser.levelText}
              </BrandText>

              <View
                style={{
                  marginTop: 60,
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <BrandText style={fontSemibold20}>My Portfolio</BrandText>
                <SecondaryButton size="SM" text="See Project (7)" />
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginTop: 20,
                }}
              >
                {gigData.sellerUser.portfolios.map((item, index) => (
                  <PortfolioImage
                    key={`portfolio-${index}`}
                    width={191}
                    height={191}
                    source={item}
                    style={{ marginLeft: 10, marginTop: 10 }}
                  />
                ))}
              </View>

              <BrandText
                style={[fontSemibold20, { marginTop: 30, marginBottom: 20 }]}
              >
                Compare Package
              </BrandText>

              <LogoDesignDetailsTab
                serviceLevels={gigData ? gigData.serviceLevels : []}
              />

              {gigData.reviews ? (
                <ReviewsStats reviews={gigData.reviews} />
              ) : (
                <></>
              )}
              {gigData.reviews && gigData.reviews.items ? (
                <DisplayReviews reviews={gigData.reviews.items} />
              ) : (
                <></>
              )}

              {gigData.tags ? <RelatedTags tags={gigData.tags} /> : <></>}

              {/*<DisplayMoreServices />*/}
            </View>

            {gigData.serviceLevels ? (
              <ServicesCard
                gigId={gigData.id}
                serviceLevels={gigData.serviceLevels}
              />
            ) : null}
          </View>
        </View>
      </FreelanceServicesScreenWrapper>
    )
  );
};
