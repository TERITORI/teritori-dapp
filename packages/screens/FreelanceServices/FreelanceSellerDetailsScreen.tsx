import React, { useState, useEffect } from "react";
import { TouchableOpacity, useWindowDimensions, View } from "react-native";

import { getSellerUser } from "./query/data";
import heart from "../../../assets/icons/heart.svg";
import penSVG from "../../../assets/icons/manage.svg";
import behanceIcon from "../../../assets/icons/social-network/behance-grey.svg";
import dribbleIcon from "../../../assets/icons/social-network/dribble-grey.svg";
import facebookIcon from "../../../assets/icons/social-network/facebook-grey.svg";
import githubIcon from "../../../assets/icons/social-network/github-grey.svg";
import googleIcon from "../../../assets/icons/social-network/google-grey.svg";
import twitterIcon from "../../../assets/icons/social-network/twitter-grey.svg";
import youtubeIcon from "../../../assets/icons/social-network/youtube-grey.svg";
import trashSVG from "../../../assets/icons/trash.svg";
import { BrandText } from "../../components/BrandText";
import FlexRow from "../../components/FlexRow";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { AddNewCertificationCard } from "../../components/freelanceServices/Cards/AddNewCertificationCard";
import { AddNewEducationCard } from "../../components/freelanceServices/Cards/AddNewEducationCard";
import { AddNewLangCard } from "../../components/freelanceServices/Cards/AddNewLangCard";
import { AddNewSkillCard } from "../../components/freelanceServices/Cards/AddNewSkillCard";
import { GigList } from "../../components/freelanceServices/Gig/GigList";
import { ManageEscrowButton } from "../../components/freelanceServices/common/ManageEscrowButton";
import { StarRating } from "../../components/freelanceServices/common/StarRating";
import {
  LangInfo,
  EducationInfo,
  CertificationInfo,
  SkillInfo,
  SellerUser,
} from "../../components/freelanceServices/types/fields";
import { AvatarImage } from "../../components/inputs/AvatarImage";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { TeritoriSellerClient } from "../../contracts-clients/teritori-freelance/TeritoriSeller.client";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  mustGetCosmosNetwork,
  getKeplrSigningCosmWasmClient,
  getUserId,
} from "../../networks";
import { mustGetFreelanceClient } from "../../utils/backend";
import { uploadJSONToIPFS } from "../../utils/ipfs";
import { ScreenFC } from "../../utils/navigation";
import {
  errorColor,
  neutral44,
  neutral00,
  neutral77,
  yellowDefault,
  successColor,
  neutralA3,
  primaryColor,
  secondaryColor,
  neutral17,
  neutral67,
  neutral33,
  neutral22,
} from "../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold16,
  fontSemibold20,
  fontSemibold14,
} from "../../utils/style/fonts";
import { layout, leftMarginMainContent } from "../../utils/style/layout";

export const FreelanceSellerDetailsScreen: ScreenFC<
  "FreelanceServicesSellerDetails"
> = ({
  route: {
    params: { address: sellerAddress },
  },
}) => {
  const [sellerUser, setSellerUser] = useState<SellerUser | null>(null);
  const wallet = useSelectedWallet();
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(networkId, selectedWallet?.address);
  useEffect(() => {
    const getSellerUserInfo = async () => {
      try {
        if (!sellerAddress) return;
        const freelanceClient = mustGetFreelanceClient(networkId);
        const res = await freelanceClient.SellerProfile({ sellerAddress });
        const profileHash = res.ipfs;
        const _sellerUser = await getSellerUser(profileHash);
        setAvatarUrl(_sellerUser.profilePic);
        setDescription(_sellerUser.intro);
        setLangInfoList(_sellerUser.languages);
        setSkillInfoList(
          _sellerUser.skills.map((skillInfo: any) => skillInfo.name)
        );
        setEducationInfoList(_sellerUser.education);
        setCertificationInfoList(_sellerUser.certifications);
        setIsEditable(!!(wallet && sellerAddress === wallet.address));
        setSellerUser(_sellerUser);
      } catch (err) {
        console.log(err);
      }
    };
    if (sellerAddress) {
      getSellerUserInfo();
    }
  }, [sellerAddress, wallet, networkId]);

  const { width } = useWindowDimensions();
  const [isEditable, setIsEditable] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    sellerUser ? sellerUser.profilePic : ""
  );
  // const [portfolios, setPortfolios] = useState(data ? data.user.portfolios:[]);

  const [isEditName, setIsEditName] = useState(false);
  const [userName, setUserName] = useState(
    sellerUser ? sellerUser.username : ""
  );

  const [description, setDescription] = useState(
    sellerUser ? sellerUser.intro : ""
  );

  const [langInfoList, setLangInfoList] = useState<LangInfo[]>(
    sellerUser ? sellerUser.languages : []
  );
  const [editLangValue, setEditLangValue] = useState<LangInfo | undefined>(
    undefined
  );
  const [indexLangValue, setIndexLangValue] = useState(-1);
  const [isEditLang, setIsEditLang] = useState(false);

  const [skillInfoList, setSkillInfoList] = useState<string[]>(
    sellerUser
      ? sellerUser.skills.map((skillInfo: SkillInfo) => skillInfo.name)
      : []
  );
  const [indexSkillValue, setIndexSkillValue] = useState(-1);
  const [editSkillValue, setEditSkillValue] = useState<string | undefined>(
    undefined
  );
  const [isEditSkill, setIsEditSkill] = useState(false);

  const [isEditEducation, setIsEditEducation] = useState(false);
  const [educationInfoList, setEducationInfoList] = useState<EducationInfo[]>(
    sellerUser ? sellerUser.education : []
  );
  const [editEducationValue, setEditEducationValue] = useState<
    EducationInfo | undefined
  >(undefined);
  const [indexEducationValue, setIndexEducationValue] = useState(-1);

  const [isEditCertification, setIsEditCertification] = useState(false);
  const [certificationInfoList, setCertificationInfoList] = useState<
    CertificationInfo[]
  >(sellerUser ? sellerUser.certifications : []);
  const [editCertificationValue, setEditCertificationValue] = useState<
    CertificationInfo | undefined
  >(undefined);
  const [indexCertificationValue, setIndexCertificationValue] = useState(-1);

  const [isEditDescription, setIsEditDescription] = useState(false);

  const isKeplrConnected = useIsKeplrConnected();

  const { setToastError } = useFeedbacks();

  // const fileRef = createRef<HTMLInputElement>();

  const onPressUpdateName = () => {
    if (sellerUser && sellerUser.username.trim() === "") return;
    setIsEditName(false);
  };
  const onPressUpdateDescription = () => {
    setIsEditDescription(false);
  };

  const updateProfile = async () => {
    //get ipfsHash for Profile
    if (!wallet) return;
    const ipfs_msg = {
      name: userName?.trim(),
      description,
      avatar: avatarUrl,
      // portfolio: portfolios,
      lang: langInfoList,
      skill: skillInfoList,
      education: educationInfoList,
      certification: certificationInfoList,
    };

    const uploadedJson = await uploadJSONToIPFS({
      json: ipfs_msg,
      networkId,
      userId,
    });
    if (!uploadedJson?.url) {
      setToastError({
        title: "Failed",
        message: "Failed to upload Profile",
      });
      return;
    }

    if (!isKeplrConnected) {
      setToastError({
        title: "Please connect Keplr",
        message: "",
      });
      return;
    }
    const signingClient = await getKeplrSigningCosmWasmClient(networkId);
    const network = mustGetCosmosNetwork(networkId);
    const client = new TeritoriSellerClient(
      signingClient,
      wallet?.address!,
      network.freelanceEscrowAddress!
    );
    const profileRes = await client.updateSellerProfile({
      seller: wallet.address,
      ipfsHash: uploadedJson.url,
    });
    if (profileRes) {
      console.log("updated profile successfully");
    } else {
      console.log("failed to update profile");
    }
    // if (profileRes) {
    //   //store to database using backend_api
    //   const res = await freelanceClient.updateProfile({
    //     userId: wallet.address,
    //     profileHash,
    //   });
    //   if (res.result === 1) {
    //     console.log("updated profile success");
    //   } else {
    //     console.log("error");
    //   }
    // }
  };

  return (
    sellerUser && (
      <ScreenContainer fullWidth noMargin>
        <FlexRow justifyContent="space-between">
          <ManageEscrowButton
            style={{ flex: 1, marginLeft: layout.padding_x4 }}
          />

          <View
            style={{
              flexDirection: width > 1280 ? "row" : "column",
              maxWidth: 1440,
              width: "100%",
              alignSelf: "center",
              paddingHorizontal: leftMarginMainContent,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: width > 1280 ? "40%" : "100%",
                minWidth: 330,
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "100%", marginTop: 24 }}>
                <TertiaryBox fullWidth>
                  <View
                    style={{
                      width: "90%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "center",
                        alignItems: "center",
                        flex: 1,
                        justifyContent: "space-between",
                        width: "100%",
                        marginTop: 16,
                        marginBottom: 8,
                      }}
                    >
                      <SVG
                        source={heart}
                        width={24}
                        height={24}
                        style={{ marginRight: 80 }}
                      />
                      <AvatarImage
                        source={sellerUser.profilePic}
                        style={{ width: 104, height: 104 }}
                        onUpdate={(ipfsHash) => {
                          setAvatarUrl(ipfsHash);
                        }}
                      />
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
                              backgroundColor:
                                sellerUser.onlineStatus! === "online"
                                  ? successColor
                                  : errorColor,
                              width: 6,
                              height: 6,
                              borderRadius: 24,
                            }}
                          />
                          <BrandText
                            style={[
                              fontSemibold16,
                              {
                                color:
                                  sellerUser.onlineStatus! === "online"
                                    ? successColor
                                    : errorColor,
                                marginLeft: 4,
                              },
                            ]}
                          >
                            {" "}
                            {sellerUser.onlineStatus}
                          </BrandText>
                        </View>
                      </View>
                    </View>
                    <BrandText style={fontSemibold20}>{userName}</BrandText>
                    {!isEditName && (
                      <View
                        style={{ flexDirection: "row", alignContent: "center" }}
                      >
                        {isEditable && (
                          <TouchableOpacity
                            style={{
                              backgroundColor: neutral22,
                              height: 40,
                              width: 40,
                              borderRadius: 24,
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: 16,
                            }}
                            onPress={() => setIsEditName(true)}
                          >
                            <SVG
                              source={penSVG}
                              width={24}
                              height={24}
                              style={{ marginTop: 2 }}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                    {isEditName && (
                      <TextInputCustom
                        label=""
                        name="Edit Name"
                        placeHolder="Type name here"
                        value={userName}
                        onChangeText={setUserName}
                        style={{ marginBottom: 15, marginTop: 10 }}
                      />
                    )}
                    {isEditName && (
                      <View
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          justifyContent: "center",
                          marginBottom: 10,
                        }}
                      >
                        <SecondaryButton
                          size="SM"
                          text="Cancel"
                          color={secondaryColor}
                          backgroundColor={neutral33}
                          style={{
                            marginRight: 10,
                          }}
                          onPress={() => setIsEditName(false)}
                        />
                        <SecondaryButton
                          size="SM"
                          text="Update"
                          color={neutral00}
                          backgroundColor={secondaryColor}
                          style={{ marginLeft: 10 }}
                          onPress={() => onPressUpdateName()}
                        />
                      </View>
                    )}
                    <BrandText
                      style={[
                        { color: neutralA3, marginTop: 8, marginBottom: 8 },
                        fontSemibold14,
                      ]}
                    >
                      {sellerUser.tagline}
                    </BrandText>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginRight: 12,
                      }}
                    >
                      <StarRating rating={sellerUser.rating} />
                      <BrandText
                        style={[
                          { color: yellowDefault, marginRight: 12 },
                          fontMedium14,
                        ]}
                      >
                        {sellerUser.rating}
                      </BrandText>
                      <BrandText style={[{ color: neutral77 }, fontMedium14]}>
                        ({sellerUser.totalReviews})
                      </BrandText>
                    </View>
                    <Separator
                      style={{ width: "100%", marginTop: 12, marginBottom: 12 }}
                    />
                    <SecondaryButton
                      fullWidth
                      size="SM"
                      text="Contact Me"
                      backgroundColor={secondaryColor}
                      color={neutral00}
                    />
                    <Separator style={{ width: "100%", marginTop: 12 }} />

                    <View style={{ flexDirection: "row", marginTop: 24 }}>
                      <View style={{ flexDirection: "column", width: 195 }}>
                        <BrandText
                          style={[
                            fontSemibold14,
                            { color: neutral77, marginBottom: 8 },
                          ]}
                        >
                          From
                        </BrandText>
                        <BrandText style={fontSemibold14}>
                          {sellerUser.country.name}
                        </BrandText>
                      </View>
                      <View style={{ flexDirection: "column", width: 160 }}>
                        <BrandText
                          style={[
                            fontSemibold14,
                            { color: neutral77, marginBottom: 8 },
                          ]}
                        >
                          Member Since
                        </BrandText>
                        <BrandText style={fontSemibold14}>
                          {sellerUser.createDate.toLocaleDateString()}
                        </BrandText>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 8,
                        marginBottom: 16,
                      }}
                    >
                      <View style={{ flexDirection: "column", width: 195 }}>
                        <BrandText
                          style={[
                            fontSemibold14,
                            { color: neutral77, marginBottom: 8 },
                          ]}
                        >
                          Avg. response time
                        </BrandText>
                        <BrandText style={fontSemibold14}>
                          {sellerUser.times.avgResponseTime}
                        </BrandText>
                      </View>
                      <View style={{ flexDirection: "column", width: 160 }}>
                        <BrandText
                          style={[
                            fontSemibold14,
                            { color: neutral77, marginBottom: 8 },
                          ]}
                        >
                          Last delivery
                        </BrandText>
                        <BrandText style={fontSemibold14}>
                          {sellerUser.times.lastDelivery}
                        </BrandText>
                      </View>
                    </View>
                  </View>
                </TertiaryBox>

                <Separator
                  style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    width: "100%",
                  }}
                >
                  <BrandText style={[fontSemibold20]}>Description</BrandText>
                  {isEditable && !isEditDescription && (
                    <TouchableOpacity
                      onPress={() => setIsEditDescription(true)}
                    >
                      <BrandText
                        style={[fontSemibold14, { color: primaryColor }]}
                      >
                        Edit Description
                      </BrandText>
                    </TouchableOpacity>
                  )}
                </View>
                {isEditable && isEditDescription && (
                  <TextInputCustom
                    label=""
                    name="Edit Description"
                    placeHolder="Type description here"
                    value={description}
                    multiline
                    numberOfLines={8}
                    onChangeText={setDescription}
                    style={{ marginBottom: 15, marginTop: 10 }}
                  />
                )}
                {isEditDescription && (
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "center",
                      marginBottom: 10,
                    }}
                  >
                    <SecondaryButton
                      size="SM"
                      text="Cancel"
                      color={secondaryColor}
                      backgroundColor={neutral33}
                      style={{
                        marginRight: 10,
                      }}
                      onPress={() => setIsEditDescription(false)}
                    />
                    <SecondaryButton
                      size="SM"
                      text="Update"
                      color={neutral00}
                      backgroundColor={secondaryColor}
                      style={{ marginLeft: 10 }}
                      onPress={() => onPressUpdateDescription()}
                    />
                  </View>
                )}

                {!isEditDescription && (
                  <BrandText
                    style={[
                      fontSemibold16,
                      { color: neutral77, marginTop: 12 },
                    ]}
                  >
                    {description}
                  </BrandText>
                )}

                <Separator
                  style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    width: "100%",
                  }}
                >
                  <BrandText style={fontSemibold20}>Languages</BrandText>
                  {isEditable && !isEditLang && (
                    <TouchableOpacity
                      onPress={() => {
                        setEditLangValue(undefined);
                        setIsEditLang(true);
                      }}
                    >
                      <BrandText
                        style={[fontSemibold14, { color: primaryColor }]}
                      >
                        Add New
                      </BrandText>
                    </TouchableOpacity>
                  )}
                </View>
                {isEditLang && (
                  <AddNewLangCard
                    value={editLangValue}
                    onClose={() => {
                      setIsEditLang(false);
                    }}
                    onAdd={(langName, langLevel) => {
                      if (indexLangValue === -1) {
                        setLangInfoList([
                          ...langInfoList,
                          {
                            name: langName,
                            level: langLevel,
                          },
                        ]);
                      } else {
                        langInfoList[indexLangValue] = {
                          name: langName,
                          level: langLevel,
                        };
                        setLangInfoList([...langInfoList]);
                      }
                    }}
                  />
                )}
                {langInfoList.map((value, index) => (
                  <View
                    key={`langinfo-${index}`}
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-end",
                      marginTop: 16,
                    }}
                  >
                    <BrandText style={[fontSemibold16, { color: neutral77 }]}>
                      {value.name} - {value.level}
                    </BrandText>
                    {isEditable && (
                      <TouchableOpacity
                        style={{
                          alignItems: "flex-start",
                          justifyContent: "center",
                          marginLeft: 10,
                        }}
                        onPress={() => {
                          setIndexLangValue(index);
                          setEditLangValue({
                            name: value.name,
                            level: value.level,
                          } as LangInfo);
                          setIsEditLang(true);
                        }}
                      >
                        <SVG
                          source={penSVG}
                          width={24}
                          height={24}
                          style={{ marginTop: 2 }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                <Separator
                  style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
                />

                <BrandText style={fontSemibold20}>Linked Accounts</BrandText>
                <TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      marginTop: 16,
                    }}
                  >
                    <SVG
                      source={twitterIcon}
                      width={16}
                      height={16}
                      style={{ marginTop: 2 }}
                    />
                    <BrandText
                      style={[
                        fontSemibold16,
                        { marginLeft: 12, color: neutralA3, marginBottom: 12 },
                      ]}
                    >
                      Twitter
                    </BrandText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View
                    style={{ flexDirection: "row", alignContent: "center" }}
                  >
                    <SVG
                      source={behanceIcon}
                      width={16}
                      height={16}
                      style={{ marginTop: 2 }}
                    />
                    <BrandText
                      style={[
                        fontSemibold16,
                        { marginLeft: 12, color: neutralA3, marginBottom: 12 },
                      ]}
                    >
                      Behance
                    </BrandText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View
                    style={{ flexDirection: "row", alignContent: "center" }}
                  >
                    <SVG
                      source={dribbleIcon}
                      width={16}
                      height={16}
                      style={{ marginTop: 2 }}
                    />
                    <BrandText
                      style={[
                        fontSemibold16,
                        { marginLeft: 12, color: neutralA3, marginBottom: 12 },
                      ]}
                    >
                      Dribble
                    </BrandText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View
                    style={{ flexDirection: "row", alignContent: "center" }}
                  >
                    <SVG
                      source={facebookIcon}
                      width={16}
                      height={16}
                      style={{ marginTop: 2 }}
                    />
                    <BrandText
                      style={[
                        fontSemibold16,
                        { marginLeft: 12, color: neutralA3, marginBottom: 12 },
                      ]}
                    >
                      Facebook
                    </BrandText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View
                    style={{ flexDirection: "row", alignContent: "center" }}
                  >
                    <SVG
                      source={githubIcon}
                      width={16}
                      height={16}
                      style={{ marginTop: 2 }}
                    />
                    <BrandText
                      style={[
                        fontSemibold16,
                        { marginLeft: 12, color: neutralA3, marginBottom: 12 },
                      ]}
                    >
                      Github
                    </BrandText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View
                    style={{ flexDirection: "row", alignContent: "center" }}
                  >
                    <SVG
                      source={googleIcon}
                      width={16}
                      height={16}
                      style={{ marginTop: 2 }}
                    />
                    <BrandText
                      style={[
                        fontSemibold16,
                        { marginLeft: 12, color: neutralA3, marginBottom: 12 },
                      ]}
                    >
                      Google
                    </BrandText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View
                    style={{ flexDirection: "row", alignContent: "center" }}
                  >
                    <SVG
                      source={youtubeIcon}
                      width={16}
                      height={16}
                      style={{ marginTop: 2 }}
                    />
                    <BrandText
                      style={[
                        fontSemibold16,
                        { marginLeft: 12, color: neutralA3, marginBottom: 12 },
                      ]}
                    >
                      Youtube
                    </BrandText>
                  </View>
                </TouchableOpacity>

                <Separator
                  style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    width: "100%",
                  }}
                >
                  <BrandText style={fontSemibold20}>Skills</BrandText>
                  {isEditable && !isEditSkill && (
                    <TouchableOpacity
                      onPress={() => {
                        setEditSkillValue(undefined);
                        setIsEditSkill(true);
                      }}
                    >
                      <BrandText
                        style={[fontSemibold14, { color: primaryColor }]}
                      >
                        Add New
                      </BrandText>
                    </TouchableOpacity>
                  )}
                </View>
                {isEditSkill && (
                  <AddNewSkillCard
                    value={editSkillValue}
                    onClose={() => {
                      setIsEditSkill(false);
                    }}
                    onAdd={(skillName) => {
                      if (indexSkillValue === -1) {
                        setSkillInfoList([...skillInfoList, skillName]);
                      } else {
                        skillInfoList[indexSkillValue] = skillName;
                        setSkillInfoList([...skillInfoList]);
                      }
                    }}
                  />
                )}
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    flexWrap: "wrap",
                    marginTop: 16,
                  }}
                >
                  {skillInfoList.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        marginRight: 12,
                        marginBottom: 12,
                        backgroundColor: neutral17,
                        borderRadius: 8,
                        borderColor: neutral44,
                        borderWidth: 0.5,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <BrandText style={[fontMedium14, { margin: 12 }]}>
                        {item}
                      </BrandText>
                      {isEditable && (
                        <>
                          <TouchableOpacity
                            style={{
                              alignItems: "flex-start",
                              justifyContent: "center",
                              marginLeft: 10,
                            }}
                            onPress={() => {
                              setIndexSkillValue(index);
                              setEditSkillValue(item);
                              setIsEditSkill(true);
                            }}
                          >
                            <SVG
                              source={penSVG}
                              width={24}
                              height={24}
                              style={{ marginTop: 2 }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              alignItems: "flex-start",
                              justifyContent: "center",
                              marginLeft: 10,
                            }}
                            onPress={() => {
                              skillInfoList.splice(index, 1);
                              setSkillInfoList([...skillInfoList]);
                            }}
                          >
                            <SVG
                              source={trashSVG}
                              width={22}
                              height={22}
                              style={{ marginTop: 2 }}
                            />
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  ))}
                </View>

                <Separator
                  style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    width: "100%",
                  }}
                >
                  <BrandText style={[fontSemibold20]}>Education</BrandText>
                  {isEditable && !isEditEducation && (
                    <TouchableOpacity
                      onPress={() => {
                        setEditEducationValue(undefined);
                        setIsEditEducation(true);
                      }}
                    >
                      <BrandText
                        style={[fontSemibold14, { color: primaryColor }]}
                      >
                        Add New
                      </BrandText>
                    </TouchableOpacity>
                  )}
                </View>
                {isEditEducation && (
                  <AddNewEducationCard
                    value={editEducationValue}
                    onClose={() => {
                      setIsEditEducation(false);
                    }}
                    onAdd={(educationInfo) => {
                      if (indexEducationValue === -1) {
                        setEducationInfoList([
                          ...educationInfoList,
                          educationInfo,
                        ]);
                      } else {
                        educationInfoList[indexEducationValue] = educationInfo;
                        setEducationInfoList([...educationInfoList]);
                      }
                    }}
                  />
                )}

                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    flexWrap: "wrap",
                    marginTop: 16,
                  }}
                >
                  {educationInfoList.map((item, index) => (
                    <View
                      style={{ flexDirection: "column", marginBottom: 8 }}
                      key={`education-${index}`}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <BrandText
                          style={[
                            fontSemibold16,
                            { color: neutral77, flexGrow: 1 },
                          ]}
                        >
                          {item.title}
                        </BrandText>
                        {isEditable && (
                          <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity
                              style={{
                                alignItems: "flex-start",
                                justifyContent: "center",
                                marginLeft: 10,
                              }}
                              onPress={() => {
                                setIndexEducationValue(index);
                                setEditEducationValue(item);
                                setIsEditEducation(true);
                              }}
                            >
                              <SVG
                                source={penSVG}
                                width={24}
                                height={24}
                                style={{ marginTop: 2 }}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                alignItems: "flex-start",
                                justifyContent: "center",
                                marginLeft: 10,
                              }}
                              onPress={() => {
                                educationInfoList.splice(index, 1);
                                setEducationInfoList([...educationInfoList]);
                              }}
                            >
                              <SVG
                                source={trashSVG}
                                width={22}
                                height={22}
                                style={{ marginTop: 2 }}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                      <BrandText
                        style={[
                          fontSemibold14,
                          { color: neutral67, marginTop: 8 },
                        ]}
                      >
                        {item.title}
                      </BrandText>
                    </View>
                  ))}
                </View>
                <Separator
                  style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    width: "100%",
                  }}
                >
                  <BrandText style={[fontSemibold20]}>Certifications</BrandText>
                  {isEditable && !isEditCertification && (
                    <TouchableOpacity
                      onPress={() => {
                        setEditCertificationValue(undefined);
                        setIsEditCertification(true);
                      }}
                    >
                      <BrandText
                        style={[fontSemibold14, { color: primaryColor }]}
                      >
                        Add New
                      </BrandText>
                    </TouchableOpacity>
                  )}
                </View>
                {isEditCertification && (
                  <AddNewCertificationCard
                    value={editCertificationValue}
                    onClose={() => {
                      setIsEditCertification(false);
                    }}
                    onAdd={(certificationInfo) => {
                      if (indexCertificationValue === -1) {
                        setCertificationInfoList([
                          ...certificationInfoList,
                          certificationInfo,
                        ]);
                      } else {
                        certificationInfoList[indexCertificationValue] =
                          certificationInfo;
                        setCertificationInfoList([...certificationInfoList]);
                      }
                    }}
                  />
                )}
                <View
                  style={{
                    flexDirection: "column",
                    width: "100%",
                    flexWrap: "wrap",
                    marginTop: 16,
                  }}
                >
                  {certificationInfoList.map((item, index) => (
                    <View
                      style={{ flexDirection: "column", marginBottom: 12 }}
                      key={`certificate-${index}`}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <BrandText
                          style={[fontSemibold16, { color: neutral77 }]}
                        >
                          {item.name}
                        </BrandText>
                        {isEditable && (
                          <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity
                              style={{
                                alignItems: "flex-start",
                                justifyContent: "center",
                                marginLeft: 10,
                              }}
                              onPress={() => {
                                setIndexCertificationValue(index);
                                setEditCertificationValue(item);
                                setIsEditCertification(true);
                              }}
                            >
                              <SVG
                                source={penSVG}
                                width={24}
                                height={24}
                                style={{ marginTop: 2 }}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                alignItems: "flex-start",
                                justifyContent: "center",
                                marginLeft: 10,
                              }}
                              onPress={() => {
                                certificationInfoList.splice(index, 1);
                                setCertificationInfoList([
                                  ...certificationInfoList,
                                ]);
                              }}
                            >
                              <SVG
                                source={trashSVG}
                                width={22}
                                height={22}
                                style={{ marginTop: 2 }}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                      <BrandText
                        style={[
                          fontMedium14,
                          { color: neutral67, marginTop: 8 },
                        ]}
                      >
                        {item.name}
                      </BrandText>
                    </View>
                  ))}
                </View>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    flexDirection: "row",
                    marginTop: 10,
                  }}
                >
                  <SecondaryButton
                    size="SM"
                    text="Update Profile"
                    color={neutral00}
                    backgroundColor={secondaryColor}
                    onPress={() => updateProfile()}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                width: width > 1280 ? "60%" : "100%",
                paddingLeft: width > 1280 ? 60 : 0,
                // paddingHorizontal: width > 1280 ? 30 : 0,
              }}
            >
              <GigList gigAddress={sellerAddress} />
            </View>
          </View>

          <View style={{ flex: 1 }} />
        </FlexRow>
      </ScreenContainer>
    )
  );
};
