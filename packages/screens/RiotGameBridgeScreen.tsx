import {useIsFocused} from "@react-navigation/native";
import {Video} from "expo-av";
import React, {useEffect, useMemo, useState} from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from "react-native";
import {GameContentView} from "./component/GameContentView";
import {NFT} from "../../api/marketplace/v1/marketplace";
import {BrandText} from "../../components/BrandText";
import {useIsMobile} from "../../hooks/useIsMobile";
import {useSelectedNetworkId, useSelectedNetworkInfo} from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {useAppNavigation} from "../../utils/navigation";
import {ScrollView} from "react-native-gesture-handler";
import {useMaxResolution} from "../../hooks/useMaxResolution";
import {
  fontMedium10,
  fontMedium48, fontSemibold12, fontSemibold14,
  fontSemibold20,
  fontSemibold28,
} from "../../utils/style/fonts";
import {
  layout,
} from "../../utils/style/layout";
import {NFTBridge} from "../../components/nfts/NFTBridge";
import {SpacerColumn} from "../../components/spacer";
import {minNFTWidth} from "../../components/nfts/NFTs";
import {
  codGrayColor,
  errorColor,
  neutral00,
  neutral33,
  neutral44,
  neutralA3,
  yellowDefault
} from "../../utils/style/colors";
import {Separator} from "../../components/Separator";
import {OptimizedImage} from "../../components/OptimizedImage";
import {TrashIcon} from "react-native-heroicons/outline";
import {PrimaryButton} from "../../components/buttons/PrimaryButton";
import {SecondaryButton} from "../../components/buttons/SecondaryButton";

const RIPPER_SLOTS = [0, 1, 2, 3, 4, 5];
const EMBEDDED_VIDEO_URI =
  "https://bafybeihfkmpunve47w4avfnuv3mfnsgoqclahpx54zj4b2ypve52iqmxsa.ipfs.nftstorage.link/";
const embeddedVideoHeight = 267;
const embeddedVideoWidth = 468;

const DATA: NFT[] = [
  {
    "id": "tori-tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw-1005",
    "networkId": "networkId",
    "imageUri": "https://imgproxy.tools.teritori.com/insecure/width:462/height:462/plain/ipfs%3A%2F%2Fbafybeidkvnwj3cilbfitxnlhgcqaijn7cnqk5puvaoiriy2ghsjk7dstsi%2Fnft.png",
    "name": "The R!ot #1005",
    "mintAddress": "tori-tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw-1005",
    "price": "12",
    "denom": "denom",
    "isListed": false,
    "textInsert": "textInsert",
    "collectionName": "The R!ot",
    "ownerId": "123",
    "nftContractAddress": "tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw",
    "lockedOn": "",
    "attributes": [
      {
        "traitType": "on",
        "value": "10"
      }
    ]
  },
  {

    "id": "tori-tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw-1206",
    "networkId": "networkId",
    "imageUri": "https://imgproxy.tools.teritori.com/insecure/width:462/height:462/plain/ipfs%3A%2F%2Fbafybeigeklcyt2pabphp6vhr5o7ewv3mqulubxpmnucq5awhyy7qjc6x44%2Fnft.png",
    "name": "The R!ot #1206",
    "mintAddress": "tori-tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw-1206",
    "price": "12",
    "denom": "denom",
    "isListed": false,
    "textInsert": "textInsert",
    "collectionName": "The R!ot",
    "ownerId": "123",
    "nftContractAddress": "tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw",
    "lockedOn": "",
    "attributes": [
      {
        "traitType": "on",
        "value": "10"
      }
    ]
  },
  {

    "id": "tori-tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw-1206",
    "networkId": "networkId",
    "imageUri": "https://imgproxy.tools.teritori.com/insecure/width:250/height:250/plain/ipfs%3A%2F%2Fbafybeidlokq5yuduyh5547e24q5uo75o6szraoytgkb57ih7asitvubbti%2Fnft.png",
    "name": "The R!ot #1886",
    "mintAddress": "tori-tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw-1206",
    "price": "12",
    "denom": "denom",
    "isListed": false,
    "textInsert": "textInsert",
    "collectionName": "The R!ot",
    "ownerId": "123",
    "nftContractAddress": "tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw",
    "lockedOn": "",
    "attributes": [
      {
        "traitType": "on",
        "value": "10"
      }
    ]
  },
  {

    "id": "tori-tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw-1206",
    "networkId": "networkId",
    "imageUri": "https://imgproxy.tools.teritori.com/insecure/width:462/height:462/plain/ipfs%3A%2F%2Fbafybeibty57ysxgufpf7n5gmmgtc7vdhb6yrlpbaqfllz6vs3mezsuj7ry%2Fnft.png",
    "name": "The R!ot #2814",
    "mintAddress": "tori-tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw-1206",
    "price": "12",
    "denom": "denom",
    "isListed": false,
    "textInsert": "textInsert",
    "collectionName": "The R!ot",
    "ownerId": "123",
    "nftContractAddress": "tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw",
    "lockedOn": "",
    "attributes": [
      {
        "traitType": "on",
        "value": "10"
      }
    ]
  },
  {

    "id": "tori-tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw-1206",
    "networkId": "networkId",
    "imageUri": "https://imgproxy.tools.teritori.com/insecure/width:462/height:462/plain/ipfs%3A%2F%2Fbafybeiehgdqtxwqeidgjitarcv7qzjz6buyffmlweorlj3g252jnbjppse%2Fnft.png",
    "name": "The R!ot #8",
    "mintAddress": "tori-tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw-1206",
    "price": "12",
    "denom": "denom",
    "isListed": false,
    "textInsert": "textInsert",
    "collectionName": "The R!ot",
    "ownerId": "123",
    "nftContractAddress": "tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw",
    "lockedOn": "",
    "attributes": [
      {
        "traitType": "on",
        "value": "10"
      }
    ]
  }
];

export const RiotGameBridgeScreen: React.FC = () => {

  const isMobile = useIsMobile();
  const navigation = useAppNavigation();
  const selectedWallet = useSelectedWallet();
  const networkId = useSelectedNetworkId();
  const networkInfo = useSelectedNetworkInfo;
  console.log("--------");
  console.log(useSelectedNetworkInfo());

  const videoRef = React.useRef<Video>(null);
  const isScreenFocused = useIsFocused();
  const [isBridgeApproved, setIsBridgeApproved] = useState(false)

  const [nfts, setNfts] = useState<NFT[]>([])
  const [selectedNfts, setSelectedNfts] = useState<NFT[]>([]);

  const {height} = useMaxResolution({isLarge: true});
  const halfGap = layout.spacing_x1;
  const [containerWidth, setContainerWidth] = useState(0);
  const elemsPerRow = Math.floor(containerWidth / minNFTWidth) || 1;
  const elemSize = elemsPerRow
    ? (containerWidth - halfGap * (elemsPerRow - 1) * 2) / elemsPerRow
    : nfts?.length || 0;

  const gridHalfGutter = 12;
  let padded = nfts;
  const SideCartWidth = 245 + 10;

  // Stop video when changing screen through react-navigation
  useEffect(() => {
    if (!isScreenFocused && videoRef.current) {
      videoRef.current.pauseAsync();
    }
  }, [isScreenFocused]);

  // Check is the Bridge Is already Approved
  useEffect(() => {
    setNfts(DATA)
  }, []);


  // Check is the Bridge Is already Approved
  useEffect(() => {
    const get_bridge = false
    if (get_bridge) {
      setIsBridgeApproved(false);
    }
  }, [isBridgeApproved]);


  // const cartIsShown = useShowCart();
  const {width} = useMaxResolution({
    responsive: true,
    noMargin: false,
    isLarge: true,
  });



  if (nfts.length % elemsPerRow !== 0 && elemsPerRow > 1) {
    const padding = Array(elemsPerRow - (nfts.length % elemsPerRow))
      .fill(undefined)
      .map((_, i) => {
        const n: NFT = {
          id: `padded-${i}`,
          networkId: "",
          imageUri: "",
          name: "",
          mintAddress: "",
          price: "",
          denom: "",
          isListed: false,
          textInsert: "",
          collectionName: "",
          ownerId: "",
          nftContractAddress: "",
          lockedOn: "",
          attributes: [],
        };
        return n;
      });
    padded = nfts.concat();
  }


  const nftViewStyle = useMemo(() => {
    return {
      width: elemSize,
    };
  }, [elemSize]);

  // Approve
  const approveTheBridge = () => {
    setIsBridgeApproved(true);
  };

  const handleSelectItem = (index: number) => {
    const temp = [...nfts];
    const getSelected = temp.at(index)
    if (getSelected) {
      setSelectedNfts([getSelected]);
    }
  };


  return (
    <GameContentView>
      <View>
        <BrandText
          style={[
            {
              alignSelf: "center",
            },
            isMobile ? fontSemibold28 : fontMedium48,
          ]}
        >
          NFT Bridge
        </BrandText>
      </View>


      <View
        style={{
          justifyContent: "space-around",
          // margin: layout.spacing_x1_5,
          // flexDirection: "row",
          flexWrap: "wrap",
          marginTop: layout.spacing_x4,
        }}
      >

        <View
          style={[
            styles.childrenContainer,
            {width, flex: 1},
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "nowrap",
            }}
          >
            <ScrollView
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: "center",
                width: width - SideCartWidth,
              }}
            >
              <FlatList
                onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
                style={{width: "100%"}}
                contentContainerStyle={{maxHeight: height}}
                columnWrapperStyle={
                  elemsPerRow < 2
                    ? undefined
                    : {flex: 1, justifyContent: "space-between"}
                }
                numColumns={elemsPerRow}
                key={`nft-flat-list-${elemsPerRow}`}
                ItemSeparatorComponent={() => <SpacerColumn size={2}/>}
                data={nfts}
                onEndReachedThreshold={4}
                ListEmptyComponent={
                  <BrandText style={fontSemibold20}>No results found.</BrandText>
                }
                renderItem={({item, index}: { item: NFT, index: number }) => {

                  const selected = selectedNfts.includes(item);
                  return (
                    <>
                      <NFTBridge key={item.id} data={item} style={nftViewStyle} selected={selected}
                                 onPress={() => handleSelectItem(index)}/>
                    </>
                  )
                }}
              />
            </ScrollView>
            <SideBridge
              style={{
                position: "absolute",
                right: -10,
                flexDirection: "column",
                width: 245,
                marginBottom: layout.spacing_x2_5,
                backgroundColor: neutral00,
                borderRadius: layout.spacing_x2,
                borderColor: neutral33,
                borderWidth: 1,
                paddingVertical: layout.spacing_x1,
                // paddingHorizontal: layout.spacing_x1_5,
                borderStyle: "solid",
              }}
              onApproveTheBridge={() => approveTheBridge()}
              isBridgeApproved={isBridgeApproved}
              selected={selectedNfts}
              setSelected={setSelectedNfts}
            />
          </View>
        </View>
      </View>
    </GameContentView>
  );
};

const SideBridge: React.FC<{
  style?: StyleProp<ViewStyle>;
  onApproveTheBridge: () => void;
  selected: NFT[],
  setSelected: any,
  isBridgeApproved: boolean,
}> = (
  {
    style,
    onApproveTheBridge,
    selected,
    setSelected,
    isBridgeApproved
  }) => {
  const handleRemoveCartItem = (index: number) => {
    const temp = [...selected];
    temp.splice(index, 1);
    setSelected(temp);
  };
  const handleEmptyCart = () => {
    setSelected([]);
  };
  return (
    <View style={style}>
      {/*Header*/}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "space-between",
          borderStyle: "solid",
          borderBottomColor: neutral44,
          borderWidth: 1,
          marginBottom: 10,
          paddingBottom: 6,
          paddingHorizontal: layout.spacing_x1_5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <BrandText style={fontSemibold14}>Bridge </BrandText>
        </View>
        <BrandText
          style={[
            {
              backgroundColor: "rgba(244, 111, 118, 0.22)",
              borderStyle: "solid",
              borderWidth: 1,
              borderRadius: 32,
              width: 37,
              height: 18,
              color: errorColor,
              paddingTop: 2.5,
              paddingRight: 6,
              paddingBottom: 2,
              paddingLeft: 6,
            },
            fontMedium10,
          ]}
          onPress={() => handleEmptyCart()}
        >
          Clear
        </BrandText>
      </View>
      {selected ? (
        <View style={{paddingHorizontal: layout.spacing_x1_5}}>
          <FlatList
            data={selected}
            ListEmptyComponent={() => {
              return (
                <>
                <View
                  style={{
                    borderRadius: 8,
                    padding: layout.spacing_x1,
                    marginBottom: layout.spacing_x1,
                    height: 60
                  }}
                >
                </View>
                </>
              )}}
            renderItem={({item, index}) => {
              return (
                <>
                  <View
                    style={{
                      backgroundColor: codGrayColor,
                      borderRadius: 8,
                      padding: layout.spacing_x1,
                      marginBottom: layout.spacing_x1,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        alignItems: "center",
                        marginBottom: layout.spacing_x0_5,
                      }}
                    >
                      <OptimizedImage
                        sourceURI={item?.imageUri}
                        width={40}
                        height={40}
                        style={{
                          height: 40,
                          width: 40,
                          borderRadius: 4,
                          marginRight: 6,
                        }}
                      />
                      <BrandText style={fontSemibold12}>{item?.name}</BrandText>
                      <Pressable onPress={() => handleRemoveCartItem(index)}>
                        <TrashIcon size={14} color={neutralA3}/>
                      </Pressable>
                    </View>
                  </View>
                </>
              );
            }}
          />
        </View>
      ) : null}
      <Separator/>

      {/*Footer*/}
      <View style={{paddingHorizontal: layout.spacing_x1_5}}>
        <BrandText style={[fontSemibold12, {color: neutralA3}]}>
          Price:
        </BrandText>
        <Separator/>
        <View
          style={{
            marginTop: layout.spacing_x1,
          }}
        >
          {isBridgeApproved ? (
            <PrimaryButton fullWidth color={yellowDefault} size="SM" text={"Bridge your NFT"}
                           disabled={selected.length <= 0}/>
          ) : (
            <SecondaryButton fullWidth color={yellowDefault} size="SM" text={"Approve Bridge"}
                             onPress={onApproveTheBridge}/>
          )}
        </View>
      </View>
    </View>
  )
}


const colStyles: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    flexDirection: "row",
  },
  childrenContainer: {
    height: "100%",
    alignSelf: "center",
  },
});
