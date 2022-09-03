import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { DraxProvider, DraxView } from "react-native-drax";

import avaSvg from "../../../assets/icons/ava.svg";
import teritorriSvg from "../../../assets/icons/teritori.svg";
import apeOneSvg from "../../../assets/nft/ape-one.svg";
import etherumGangSvg from "../../../assets/nft/etherum-gang.svg";
import freeSnowDenSvg from "../../../assets/nft/free-snowden.svg";
import notACrimeSvg from "../../../assets/nft/not-a-crime.svg";
import privacySvg from "../../../assets/nft/privacy.svg";
import rideOrDieSvg from "../../../assets/nft/ride-or-die.svg";
import satoshiSvg from "../../../assets/nft/satoshi.svg";
import solFarmSvg from "../../../assets/nft/sol-farm.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SecondaryAltButton } from "../../components/buttons/SecondaryAltButton";
import ExistingNftType from "../../components/riotersFooter/ExistingNftType";
import NewNftType from "../../components/riotersFooter/NewNftType";
import NftTypeTab from "../../components/riotersFooter/NftTypeTab";
import SelectNewNft, {
  fakeNft,
} from "../../components/riotersFooter/SelectedNewNft";
import { neutral33 } from "../../utils/style/colors";

const fakeNewNtfCollections = [
  {
    id: "0",
    avatar: avaSvg,
    name: "throwbackpushchair",
    badge: true,
  },
  {
    id: "1",
    avatar: avaSvg,
    name: "throwbackpushchair",
    badge: true,
  },
  {
    id: "2",
    avatar: avaSvg,
    name: "throwbackpushchair",
    badge: true,
  },
  {
    id: "3",
    avatar: avaSvg,
    name: "throwbackpushchair",
    badge: true,
  },
  {
    id: "4",
    avatar: avaSvg,
    name: "throwbackpushchair",
    badge: true,
  },
  {
    id: "5",
    avatar: avaSvg,
    name: "throwbackpushchair",
    badge: true,
  },
  {
    id: "6",
    avatar: avaSvg,
    name: "throwbackpushchair",
    badge: true,
  },
  {
    id: "7",
    avatar: avaSvg,
    name: "throwbackpushchair",
    badge: true,
  },
  {
    id: "8",
    avatar: avaSvg,
    name: "throwbackpushchair",
    badge: true,
  },
  {
    id: "9",
    avatar: avaSvg,
    name: "throwbackpushchair",
    badge: true,
  },
  {
    id: "10",
    avatar: avaSvg,
    name: "throwbackpushchair",
    badge: true,
  },
  {
    id: "12",
    avatar: avaSvg,
    name: "throwbackpushchair",
    badge: true,
  },
  {
    id: "13",
    avatar: avaSvg,
    name: "throwbackpushchair",
    badge: true,
  },
  {
    id: "14",
    avatar: avaSvg,
    name: "throwbackpushchair",
    badge: true,
  },
  {
    id: "15",
    avatar: avaSvg,
    name: "throwbackpushchair",
    badge: true,
  },
  {
    id: "16",
    avatar: avaSvg,
    name: "throwbackpushchair",
    badge: true,
  },
  {
    id: "17",
    avatar: avaSvg,
    name: "throwbackpushchair",
    badge: true,
  },
  {
    id: "18",
    avatar: avaSvg,
    name: "throwbackpushchair",
    badge: true,
  },
];

const oldNftPositions = [
  {
    id: "0",
    svg: apeOneSvg,
    width: 74,
    height: 74,
    top: 388,
    left: 0,
  },
  {
    id: "1",
    svg: etherumGangSvg,
    width: 74,
    height: 43,
    top: 229,
    left: 478,
  },
  {
    id: "2",
    svg: freeSnowDenSvg,
    width: 114,
    height: 77,
    top: 415,
    left: 575,
  },
  {
    id: "3",
    svg: notACrimeSvg,
    width: 130,
    height: 72,
    top: 279,
    left: 654,
  },
  {
    id: "4",
    svg: rideOrDieSvg,
    width: 40,
    height: 36,
    top: 289,
    left: 38,
  },
  {
    id: "5",
    svg: satoshiSvg,
    width: 56,
    height: 59,
    top: 333,
    left: 446,
  },
  {
    id: "6",
    svg: solFarmSvg,
    width: 82,
    height: 82,
    top: 253,
    left: 174,
  },
  {
    id: "7",
    svg: apeOneSvg,
    width: 74,
    height: 74,
    top: 388,
    left: 747,
  },
  {
    id: "8",
    svg: solFarmSvg,
    width: 82,
    height: 82,
    top: 253,
    left: 922,
  },
  {
    id: "9",
    svg: privacySvg,
    width: 148,
    height: 100,
    top: 396,
    left: 159,
  },
  {
    id: "10",
    svg: privacySvg,
    width: 148,
    height: 100,
    top: 396,
    left: 850,
  },
];

export const RiotersFooterScreen: React.FC = () => {
  const [nftType, setNftType] = useState<string>("New");
  const [searchNewNftCollection, setSearchNewNftCollection] =
    useState<string>("");
  const [searchNft, setSearchNft] = useState<string>("");
  const [nftId, setNftId] = useState<string>("");
  const [nftDrop, setNftDrop] = useState<any>(null);
  const [nftPositions, setNftPositions] = useState(undefined);

  const MapNftType = new Map([
    [
      "New",
      <NewNftType
        searchNewNftCollection={searchNewNftCollection}
        setSearchNewNftCollection={setSearchNewNftCollection}
        setNftId={setNftId}
        newNftCollections={fakeNewNtfCollections}
      />,
    ],
    ["Existing", <ExistingNftType />],
  ]);

  return (
    <ScreenContainer>
      <DraxProvider>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginLeft: -110,
            width: "100%",
          }}
        >
          <View
            style={{
              width: 240,
              paddingTop: 24,
              borderRightWidth: 1,
              borderColor: neutral33,
            }}
          >
            {!nftId ? (
              <>
                <View style={{ width: 220 }}>
                  <BrandText style={{ color: "white", fontSize: 14 }}>
                    NFT type for the Rioters’ Footer
                  </BrandText>
                  <NftTypeTab nftType={nftType} setNftType={setNftType} />
                  <View
                    style={{
                      height: 1,
                      backgroundColor: neutral33,
                      marginTop: 16,
                    }}
                  />
                </View>
                <ScrollView>
                  <View style={{ width: 220 }}>{MapNftType.get(nftType)}</View>
                </ScrollView>
              </>
            ) : (
              <SelectNewNft
                nftId={nftId}
                setNftId={setNftId}
                searchNft={searchNft}
                setSearchNft={setSearchNft}
                newNftCollections={fakeNewNtfCollections}
              />
            )}
          </View>
          <View style={{ marginLeft: 20, width: "100%" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 24,
                marginBottom: 16,
                width: "100%",
              }}
            >
              <BrandText style={{ color: "white", fontSize: 28 }}>
                Choose the exact position in footer
              </BrandText>
              <SecondaryAltButton
                text="Preview"
                onPress={() => {
                  console.log("press preview");
                }}
                width={126}
                height={48}
                style={{ marginRight: 34 }}
              />
            </View>
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DraxView
                style={{
                  width: 1030,
                  height: 552,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: neutral33,
                }}
                onReceiveDragDrop={(event) => {
                  console.log(event);
                  if (!nftDrop) {
                    setNftDrop(
                      fakeNft.find((nft) => nft.id === event.dragged.payload)
                    );
                    setNftPositions({
                      x:
                        event.receiver.receiveOffset.x -
                        event.dragged.grabOffset.x,
                      y:
                        event.receiver.receiveOffset.y -
                        event.dragged.grabOffset.y,
                      width: 104,
                      height: 104,
                    });
                  }
                }}
                renderContent={() => (
                  <>
                    <SVG
                      width={94}
                      height={102}
                      source={teritorriSvg}
                      style={{
                        alignSelf: "center",
                        marginTop: 43,
                        zIndex: 9999,
                      }}
                    />
                    {oldNftPositions.map((nft) => (
                      <SVG
                        key={nft.id}
                        width={nft.width}
                        height={nft.height}
                        source={nft.svg}
                        style={{
                          position: "absolute",
                          left: nft.left,
                          top: nft.top,
                        }}
                      />
                    ))}
                    {nftDrop && nftPositions && (
                      <SVG
                        width={nftPositions.width}
                        height={nftPositions.height}
                        source={nftDrop.svg}
                        style={{
                          position: "absolute",
                          left: nftPositions.x,
                          top: nftPositions.y,
                        }}
                      />
                    )}
                  </>
                )}
              />
            </View>
          </View>
        </View>
      </DraxProvider>
    </ScreenContainer>
  );
};
