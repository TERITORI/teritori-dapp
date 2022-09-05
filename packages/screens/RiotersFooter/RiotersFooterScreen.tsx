import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, ScrollView, Image } from "react-native";
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
import NftAdjustments from "../../components/riotersFooter/NftAdjustments";
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
    date: new Date("August 15, 2022 15:00:00"),
  },
  {
    id: "1",
    svg: etherumGangSvg,
    width: 74,
    height: 43,
    top: 229,
    left: 478,
    date: new Date("August 16, 2022 15:00:00"),
  },
  {
    id: "2",
    svg: freeSnowDenSvg,
    width: 114,
    height: 77,
    top: 415,
    left: 575,
    date: new Date("August 17, 2022 15:00:00"),
  },
  {
    id: "3",
    svg: notACrimeSvg,
    width: 130,
    height: 72,
    top: 279,
    left: 654,
    date: new Date("August 18, 2022 15:00:00"),
  },
  {
    id: "4",
    svg: rideOrDieSvg,
    width: 40,
    height: 36,
    top: 289,
    left: 38,
    date: new Date("August 19, 2022 15:00:00"),
  },
  {
    id: "5",
    svg: satoshiSvg,
    width: 56,
    height: 59,
    top: 333,
    left: 446,
    date: new Date("August 20, 2022 15:00:00"),
  },
  {
    id: "6",
    svg: solFarmSvg,
    width: 82,
    height: 82,
    top: 253,
    left: 174,
    date: new Date("August 21, 2022 15:00:00"),
  },
  {
    id: "7",
    svg: apeOneSvg,
    width: 74,
    height: 74,
    top: 388,
    left: 747,
    date: new Date("August 22, 2022 15:00:00"),
  },
  {
    id: "8",
    svg: solFarmSvg,
    width: 82,
    height: 82,
    top: 253,
    left: 922,
    date: new Date("August 23, 2022 15:00:00"),
  },
  {
    id: "9",
    svg: privacySvg,
    width: 148,
    height: 100,
    top: 396,
    left: 159,
    date: new Date("August 24, 2022 15:00:00"),
  },
  {
    id: "10",
    svg: privacySvg,
    width: 148,
    height: 100,
    top: 396,
    left: 850,
    date: new Date("August 25, 2022 15:00:00"),
  },
];

export const RiotersFooterScreen: React.FC = () => {
  const [nftType, setNftType] = useState<string>("New");
  const [searchNewNftCollection, setSearchNewNftCollection] =
    useState<string>("");
  const [searchNft, setSearchNft] = useState<string>("");
  const [nftCollectionId, setNftCollectionId] = useState<string>("");
  const [nftDrop, setNftDrop] = useState<any>(null);
  const [nftPositions, setNftPositions] = useState(undefined);
  const [oldNftPositionsWithZIndex, setOldNftPositionsWithZIndex] =
    useState(undefined);
  const [price, setPrice] = useState<number>(7.8);

  useEffect(() => {
    setOldNftPositionsWithZIndex(
      oldNftPositions.sort((a, b) => a.date.getTime() - b.date.getTime())
    );
    console.log(
      oldNftPositions.sort((a, b) => a.date.getTime() - b.date.getTime())
    );
  }, [oldNftPositions]);

  const MapNftType = new Map([
    [
      "New",
      <NewNftType
        searchNewNftCollection={searchNewNftCollection}
        setSearchNewNftCollection={setSearchNewNftCollection}
        setNftCollectionId={setNftCollectionId}
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
            {!nftCollectionId ? (
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
            ) : nftDrop && nftPositions ? (
              <NftAdjustments
                nftCollectionId={nftCollectionId}
                newNftCollections={fakeNewNtfCollections}
                nftDrop={nftDrop}
                setNftDrop={setNftDrop}
                nftPositions={nftPositions}
                setNftPositions={setNftPositions}
                price={price}
                setPrice={setPrice}
              />
            ) : (
              <SelectNewNft
                nftCollectionId={nftCollectionId}
                setNftCollectionId={setNftCollectionId}
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
                  backgroundColor: "black",
                }}
                onReceiveDragDrop={(event) => {
                  console.log(event);
                  if (!nftDrop || nftDrop.id === event.dragged.payload) {
                    if (!nftDrop) {
                      setNftDrop(
                        fakeNft.find((nft) => nft.id === event.dragged.payload)
                      );
                    }
                    setNftPositions({
                      ...nftPositions,
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
                  <DraxViewReceiverContent
                    oldNftPositionsWithZIndex={oldNftPositionsWithZIndex}
                    nftDrop={nftDrop}
                    nftPositions={nftPositions}
                  />
                )}
              />
            </View>
          </View>
        </View>
      </DraxProvider>
    </ScreenContainer>
  );
};

const DraxViewReceiverContent = ({
  oldNftPositionsWithZIndex,
  nftDrop,
  nftPositions,
}) => {
  const NtfDragAndDropInReceiverViewCallback = useCallback(
    ({ nftDrop, nftPositions, oldNftPositionsWithZIndex }) => (
      <NtfDragAndDropInReceiverView
        nftDrop={nftDrop}
        nftPositions={nftPositions}
        oldNftPositionsWithZIndex={oldNftPositionsWithZIndex}
      />
    ),
    [nftPositions]
  );

  return (
    <>
      <SVG
        width={94}
        height={102}
        source={teritorriSvg}
        style={{
          alignSelf: "center",
          marginTop: 43,
          zIndex: oldNftPositionsWithZIndex + 1,
        }}
      />
      {oldNftPositionsWithZIndex &&
        oldNftPositionsWithZIndex.map((nft, index) => (
          <SVG
            key={nft.id}
            width={nft.width}
            height={nft.height}
            source={nft.svg}
            style={{
              position: "absolute",
              left: nft.left,
              top: nft.top,
              borderColor: neutral33,
              borderWidth: 1,
              padding: 4,
              zIndex: index,
            }}
          />
        ))}
      {nftDrop && nftPositions && (
        <NtfDragAndDropInReceiverViewCallback
          nftDrop={nftDrop}
          nftPositions={nftPositions}
          oldNftPositionsWithZIndex={oldNftPositionsWithZIndex}
        />
      )}
    </>
  );
};

const NtfDragAndDropInReceiverView = ({
  nftDrop,
  nftPositions,
  oldNftPositionsWithZIndex,
}) => {
  return (
    <DraxView
      onDragStart={() => {
        console.log("start drag id", nftDrop.id);
      }}
      animateSnapback={false}
      dragPayload={nftDrop.id}
      style={{
        position: "absolute",
        left: nftPositions.x,
        top: nftPositions.y,
        zIndex: oldNftPositionsWithZIndex.length,
      }}
      draggingStyle={{ opacity: 0.5 }}
    >
      <Image
        style={{
          width: nftPositions.width,
          height: nftPositions.height,
          borderRadius: nftPositions.borderRadius
            ? (nftPositions.borderRadius *
                (nftPositions.width > nftPositions.height
                  ? nftPositions.width
                  : nftPositions.height)) /
              200
            : 0,
        }}
        source={nftDrop.svg}
      />
    </DraxView>
  );
};
