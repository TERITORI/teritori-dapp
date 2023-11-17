import {useIsFocused} from "@react-navigation/native";
import {useQueryClient} from "@tanstack/react-query";
import {ResizeMode, Video} from "expo-av";

import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    TouchableHighlight,
    View,
    ViewStyle,
    SafeAreaView,
    StyleProp, Linking
} from "react-native";

import {GameContentView} from "./component/GameContentView";

import {SimpleButton} from "./component/SimpleButton";

import {Attribute, NFT} from "../../api/marketplace/v1/marketplace";
import {BrandText} from "../../components/BrandText";

import {useIsMobile} from "../../hooks/useIsMobile";
import {useSelectedNetworkId, useSelectedNetworkInfo} from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";

import {useAppNavigation} from "../../utils/navigation";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";

import { useMaxResolution } from "../../hooks/useMaxResolution";

import {
    fontMedium10,
    fontMedium24,
    fontMedium32,
    fontMedium48, fontSemibold14,
    fontSemibold20,
    fontSemibold28,
} from "../../utils/style/fonts";
import {
    getResponsiveScreenContainerMarginHorizontal,
    layout,
    screenContainerContentMarginHorizontal
} from "../../utils/style/layout";

import {EthereumNetworkInfo, getKeplrSigningCosmWasmClient, parseNftId, txExplorerLink} from "../../networks";
import {Wallet} from "../../context/WalletsProvider";
import {getMetaMaskEthereumSigner} from "../../utils/ethereum";

import {TeritoriMinter__factory} from "../../evm-contracts-clients/teritori-bunker-minter/TeritoriMinter__factory";

import {NFTBridge, shortUserAddressFromID} from "../../components/nfts/NFTBridge";

import {NFTView} from "../../components/nfts/NFTView";
import {SpacerColumn} from "../../components/spacer";
import {minNFTWidth} from "../../components/nfts/NFTs";
import {useNFTs} from "../../hooks/useNFTs";
// import {SideCart, useShowCart} from "../Marketplace/SideCart";
import {errorColor, neutral00, neutral33, neutral44, neutral77} from "../../utils/style/colors";
// import {BridgeSide, useShowCart} from "./component/BridgeSide";
import {useAppDispatch} from "../../store/store";
import {useSelector} from "react-redux";
import {
    emptyCart, removeSelected,
    selectAllSelectedNFTData,
    selectSelectedNFTIds,
    setShowCart
} from "../../store/slices/marketplaceCartItems";
import {Separator} from "../../components/Separator";
import {modalMarginPadding} from "../../utils/style/modals";
import {SVG} from "../../components/SVG";
import closeSVG from "../../../assets/icons/close.svg";
import {useFeedbacks} from "../../context/FeedbacksProvider";
import {useBalances} from "../../hooks/useBalances";
import {EncodeObject} from "@cosmjs/proto-signing";
import {toUtf8} from "@cosmjs/encoding";
import {isDeliverTxFailure} from "@cosmjs/stargate";


const RIPPER_SLOTS = [0, 1, 2, 3, 4, 5];
const EMBEDDED_VIDEO_URI =
    "https://bafybeihfkmpunve47w4avfnuv3mfnsgoqclahpx54zj4b2ypve52iqmxsa.ipfs.nftstorage.link/";
const embeddedVideoHeight = 267;
const embeddedVideoWidth = 468;

export const RiotGameBridgeScreen: React.FC = () => {

    const isMobile = useIsMobile();
    const navigation = useAppNavigation();
    const selectedWallet = useSelectedWallet();
    const networkId = useSelectedNetworkId();
    const networkInfo = useSelectedNetworkInfo;
    console.log("--------");
    console.log(useSelectedNetworkInfo());
    const queryClient = useQueryClient();


    const videoRef = React.useRef<Video>(null);
    const isScreenFocused = useIsFocused();
    const [bridgeApproved, setBridgeApproved] = useState(false)

    const [nfts, setNfts] = useState<NFT[]>([
        {

            "id": "1005",
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

            "id": "1206",
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

            "id": "1886",
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

            "id": "2814",
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

            "id": "8",
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
    ])
    const [selectedId, setSelectedId] = useState<string>();


    // Stop video when changing screen through react-navigation
    useEffect(() => {
        if (!isScreenFocused && videoRef.current) {
            videoRef.current.pauseAsync();
        }
    }, [isScreenFocused]);


    // Check is the Bridge Is already Approved
    useEffect(() => {
        const get_bridge = false
        if (get_bridge) {
            setBridgeApproved(true);
        }
    }, [bridgeApproved]);


    // const cartIsShown = useShowCart();

    const {width} = useMaxResolution({
        responsive: true,
        noMargin: false,
        isLarge: true,
    });

    const gridHalfGutter = 12;


    const {height} = useMaxResolution({isLarge: true});
    const halfGap = layout.spacing_x1;
    const [containerWidth, setContainerWidth] = useState(0);
    const elemsPerRow = Math.floor(containerWidth / minNFTWidth) || 1;
    const elemSize = elemsPerRow
        ? (containerWidth - halfGap * (elemsPerRow - 1) * 2) / elemsPerRow
        : nfts?.length || 0;

    let padded = nfts;

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
        padded = nfts.concat(padding);
    }


    const nftViewStyle = useMemo(() => {
        return {
            width: elemSize,
        };
    }, [elemSize]);

    // Approve
    const approveTheBridge = () => {
        setBridgeApproved(true);
    };


    const SideCartWidth = 245 + 10;

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
                }}
            >

                <View
                    style={[
                        styles.childrenContainer,
                        { width, flex: 1 },
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
                            data={padded}
                            onEndReachedThreshold={4}

                            ListEmptyComponent={
                                <BrandText style={fontSemibold20}>No results found.</BrandText>
                            }
                            renderItem={(info) => (
                                <NFTBridge key={info.item.id} data={info.item} style={nftViewStyle}/>
                            )}
                        />
                    </ScrollView>

                    <BridgeSide
                        style={{
                            position: "absolute",
                            right: -10,
                            marginTop: layout.spacing_x4,
                            flexDirection: "column",
                            width: 245,
                            marginBottom: layout.spacing_x2_5,
                            backgroundColor: neutral00,
                            borderRadius: layout.spacing_x2,
                            borderColor: neutral33,
                            borderWidth: 1,
                            paddingVertical: layout.spacing_x1,
                            paddingHorizontal: layout.spacing_x1_5,
                            borderStyle: "solid",
                        }}
                    />


                </View>
                </View>
            </View>


        </GameContentView>
    );
};


const BridgeSide: React.FC<{ style?: StyleProp<ViewStyle> }> = ({style,
                                                                       }) => {
    const dispatch = useAppDispatch();
    const selected = useSelector(selectSelectedNFTIds);
    const handleEmptyCart = () => {
        dispatch(emptyCart());
    };

    return (
        <View style={style}>
            hihihi
            <Header
                items={selected}
                onPressClear={() => handleEmptyCart()}
            />
            {/*<FlatList*/}
            {/*    data={selected}*/}
            {/*    renderItem={({ item }) => {*/}
            {/*        return <CartItems id={item} />;*/}
            {/*    }}*/}
            {/*/>*/}
            <Separator />
        </View>
    )
};

const Header: React.FC<{
    items: any[];
    onPressClear: () => void;
}> = ({ items, onPressClear }) => {
    return (
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
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                }}
            >
                <BrandText style={fontSemibold14}>Bridge </BrandText>
                <BrandText
                    style={[
                        fontSemibold14,
                        {
                            color: neutral77,
                        },
                    ]}
                >
                    {items.length}
                </BrandText>
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
                onPress={onPressClear}
            >
                Clear
            </BrandText>

        </View>
    );
};


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
