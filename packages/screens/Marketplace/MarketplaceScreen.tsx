import { useQuery } from "@tanstack/react-query";
import { cloneDeep } from "lodash";
import React, { ReactNode, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { useSelector } from "react-redux";

import { PeriodFilter } from "./PeriodFilter";

import { PopularCollection } from "@/api/marketplace/v1/marketplace";
import { BrandText } from "@/components/BrandText";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import { OmniLink } from "@/components/OmniLink";
import { Pagination } from "@/components/Pagination";
import { ScreenContainer } from "@/components/ScreenContainer";
import { RoundedGradientImage } from "@/components/images/RoundedGradientImage";
import { SearchInput } from "@/components/sorts/SearchInput";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { TableRow } from "@/components/table/TableRow";
import { Tabs } from "@/components/tabs/Tabs";
import { useCoingeckoPrices } from "@/hooks/useCoingeckoPrices";
import { useEnabledNetworks } from "@/hooks/useEnabledNetworks";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useCollectionNavigationTarget } from "@/hooks/useNavigateToCollection";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { NetworkFeature, parseCollectionId } from "@/networks";
import { selectTimePeriod } from "@/store/slices/marketplaceFilters";
import { getMarketplaceClient } from "@/utils/backend";
import {
  CoingeckoCoin,
  CoingeckoPrices,
  getCoingeckoPrice,
} from "@/utils/coingecko";
import { prettyPrice } from "@/utils/coins";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { prettyNumber } from "@/utils/numbers";
import {
  errorColor,
  mineShaftColor,
  neutral77,
  successColor,
} from "@/utils/style/colors";
import {
  fontSemibold11,
  fontSemibold13,
  fontSemibold20,
  fontSemibold28,
  fontSemibold9,
} from "@/utils/style/fonts";
import { layout, screenContentMaxWidthLarge } from "@/utils/style/layout";
import { PrettyPrint } from "@/utils/types/marketplace";
import { arrayIncludes } from "@/utils/typescript";

const TABLE_COLUMNS = {
  rank: {
    label: "Rank",
    flex: 0.6,
  },
  collectionNameData: {
    label: "Collection",
    flex: 2.4,
  },
  tradeVolume: {
    label: "",
    flex: 1.9,
  },
  tradeVolumeDiff: {
    label: "",
    flex: 1,
  },
  sales: {
    label: "",
    flex: 1.1,
  },
  floorPrice: {
    label: "Floor Price",
    flex: 1.8,
  },
  owners: {
    label: "Owners",
    flex: 1,
  },
  supply: {
    label: "Supply",
    flex: 1.2,
  },
  mintVolume: {
    label: "",
    flex: 1.5,
  },
};

export const MarketplaceScreen: ScreenFC<"Marketplace"> = () => {
  const navigation = useAppNavigation();
  const selectedNetworkId = useSelectedNetworkId();
  const enabledNetworks = useEnabledNetworks();
  const timePeriod = useSelector(selectTimePeriod);
  const isMobile = useIsMobile();

  const marketplaceNetworks = enabledNetworks.filter((network) => {
    return network.features.includes(NetworkFeature.NFTMarketplace);
  });

  const tabs = marketplaceNetworks.reduce(
    (tabs, network) => ({
      ...tabs,
      [network.id]: { name: network.displayName },
    }),
    {} as Record<string, { name: string }>,
  );

  const tabsKeys = Object.keys(tabs);

  const [selectedTab, setSelectedTab] = useState(
    arrayIncludes(tabsKeys, selectedNetworkId)
      ? selectedNetworkId
      : tabsKeys[0],
  );

  const { data: collections } = usePopularCollections(
    selectedTab,
    timePeriod.value / 60,
  );

  const [filterText, setFilterText] = useState("");

  const handleChangeText = (e: string) => {
    setFilterText(e);
  };
  return (
    <ScreenContainer
      isLarge
      footerChildren={<></>}
      headerChildren={
        <BrandText style={fontSemibold20}>NFT Marketplace</BrandText>
      }
      responsive
      onBackPress={() => navigation.navigate("Marketplace")}
    >
      <View
        style={{
          marginTop: layout.spacing_x4,
        }}
      >
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BrandText style={fontSemibold28}>Popular Collections</BrandText>
          <Tabs
            items={tabs}
            selected={selectedTab}
            style={{ height: 48 }}
            onSelect={setSelectedTab}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            flex: 12,
            flexWrap: "nowrap",
            justifyContent: "space-between",
            marginTop: layout.spacing_x4,
            marginBottom: layout.spacing_x4,
            zIndex: 1,
          }}
        >
          <SearchInput
            style={{
              flex: 7,
            }}
            handleChangeText={handleChangeText}
          />
          <SpacerRow size={2} />
          <PeriodFilter />
        </View>
        <CollectionTable rows={collections || []} filterText={filterText} />
      </View>
    </ScreenContainer>
  );
};

const CollectionTable: React.FC<{
  rows: PopularCollection[];
  filterText: string;
}> = ({ rows, filterText }) => {
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [pageIndex, setPageIndex] = useState(0);
  const isMobile = useIsMobile();
  const timePeriod = useSelector(selectTimePeriod);
  const filteredCollections = rows.filter(({ name: collectionName }) =>
    collectionName?.toLowerCase().includes(filterText.toLowerCase()),
  );

  const floorCoins = useMemo(
    () =>
      Object.values(
        rows.reduce(
          (acc, collection) => {
            const [network] = parseCollectionId(collection.id);
            if (!network) {
              return acc;
            }
            collection.floorPrices.forEach((fp) => {
              const key = `${network.id}/${fp.denom}`;
              if (acc[key]) {
                return;
              }
              const c: CoingeckoCoin = {
                networkId: network.id,
                denom: fp.denom,
              };
              acc[key] = c;
            });
            return acc;
          },
          {} as Record<string, CoingeckoCoin>,
        ),
      ),
    [rows],
  );

  const { prices: floorPrices } = useCoingeckoPrices(floorCoins);

  const columns = cloneDeep(TABLE_COLUMNS);
  columns.tradeVolume.label = timePeriod.shortLabel + " Trade Volume";
  columns.mintVolume.label = timePeriod.shortLabel + " Mint Volume";
  columns.sales.label = timePeriod.shortLabel + " Sales";
  columns.tradeVolumeDiff.label = timePeriod.shortLabel + " Trade %";

  const maxPage = Math.max(Math.ceil(rows.length / itemsPerPage), 1);
  return (
    <View
      style={{
        justifyContent: "space-between",
        width: "100%",
        maxWidth: screenContentMaxWidthLarge,
      }}
    >
      <TableRow
        headings={
          !isMobile
            ? Object.values(columns)
            : Object.values(columns).slice(0, -5)
        }
      />
      <FlatList
        scrollEnabled={Platform.OS === "web"}
        data={filteredCollections}
        renderItem={({ item, index }) => (
          <CollectionRow collection={item} rank={index} prices={floorPrices} />
        )}
        keyExtractor={(item) => item.id}
        style={{
          minHeight: 248,
          borderTopColor: mineShaftColor,
          borderTopWidth: 1,
        }}
        contentContainerStyle={{
          paddingBottom: 150, //just to make last element visible on mobile
        }}
      />
      {filteredCollections.length > 50 && (
        <>
          <SpacerColumn size={2} />
          <Pagination
            currentPage={pageIndex}
            maxPage={maxPage}
            itemsPerPage={itemsPerPage}
            dropdownOptions={[50, 100, 200]}
            setItemsPerPage={setItemsPerPage}
            onChangePage={setPageIndex}
          />
          <SpacerColumn size={2} />
        </>
      )}
    </View>
  );
};

const PrettyPriceWithCurrency: React.FC<{
  data: PrettyPrint;
  style?: StyleProp<ViewStyle>;
}> = ({ data, style }) => {
  const isMobile = useIsMobile();

  return (
    <View
      style={[
        {
          paddingRight: layout.spacing_x1,
          flexDirection: "row",
          alignItems: "center",
        },
        style,
      ]}
    >
      {BigInt(data.amount) > 0 ? (
        <>
          <CurrencyIcon
            networkId={data.networkId}
            denom={data.denom}
            size={16}
          />
          <BrandText
            style={[
              isMobile ? fontSemibold11 : fontSemibold13,
              {
                marginLeft: layout.spacing_x0_5,
              },
            ]}
            numberOfLines={1}
          >
            {prettyPrice(data.networkId, data.amount, data.denom)}
          </BrandText>
          {!!data.usdValue && (
            <BrandText
              style={[
                isMobile ? fontSemibold9 : fontSemibold11,
                {
                  marginLeft: isMobile
                    ? layout.spacing_x0_5
                    : layout.spacing_x1,
                  color: neutral77,
                  width: isMobile ? layout.spacing_x3 : "auto",
                },
              ]}
              numberOfLines={1}
            >
              ${prettyNumber(data.usdValue, 2)}
            </BrandText>
          )}
        </>
      ) : (
        <BrandText
          style={[
            isMobile ? fontSemibold11 : fontSemibold13,
            {
              color: neutral77,
            },
          ]}
          numberOfLines={1}
        >
          -
        </BrandText>
      )}
    </View>
  );
};

const CollectionRow: React.FC<{
  collection: PopularCollection;
  rank: number;
  prices: CoingeckoPrices;
}> = ({ collection, rank, prices }) => {
  const rowData = getRowData(collection, rank, prices);
  const isMobile = useIsMobile();

  const target = useCollectionNavigationTarget(collection.id);

  const tradeDiffText = rowData["TimePeriodPercentualVolume"];
  const tradeDiffColor =
    tradeDiffText !== "-"
      ? tradeDiffText.includes("+")
        ? successColor
        : errorColor
      : neutral77;

  return (
    <OmniLink
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        borderColor: mineShaftColor,
        borderBottomWidth: 1,
        paddingVertical: layout.spacing_x2,
        paddingHorizontal: layout.spacing_x2_5,
      }}
      disabled={!target}
      to={{
        screen: target || "",
        params: { id: collection.id },
      }}
    >
      <InnerCell style={{ flex: 0.4 }}>{rowData.rank}</InnerCell>

      <View
        style={{
          flex: TABLE_COLUMNS.collectionNameData.flex,
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
          paddingRight: layout.spacing_x1,
        }}
      >
        <RoundedGradientImage
          size="XS"
          sourceURI={rowData.collectionNameData.image}
          style={{ marginRight: isMobile ? 8 : layout.spacing_x1_5 }}
        />
        <BrandText
          style={[
            isMobile ? fontSemibold11 : fontSemibold13,
            { width: isMobile ? 80 : "auto" },
          ]}
          numberOfLines={1}
        >
          {rowData.collectionNameData.collectionName}
        </BrandText>
      </View>
      <PrettyPriceWithCurrency
        data={rowData["tradeVolume"]}
        style={{
          flex: TABLE_COLUMNS.tradeVolume.flex,
        }}
      />
      <InnerCell
        style={{ flex: TABLE_COLUMNS.tradeVolumeDiff.flex }}
        textStyle={{
          color: tradeDiffColor,
          marginLeft: isMobile ? layout.spacing_x1_5 : 0,
        }}
      >
        {tradeDiffText}
      </InnerCell>
      {!isMobile && (
        <>
          <InnerCell style={{ flex: TABLE_COLUMNS.sales.flex }}>
            {rowData.sales}
          </InnerCell>
          <PrettyPriceWithCurrency
            data={rowData.floorPrice}
            style={{ flex: TABLE_COLUMNS.floorPrice.flex }}
          />
          <InnerCell style={{ flex: TABLE_COLUMNS.owners.flex }}>
            {rowData.owners}
          </InnerCell>
          <InnerCell
            style={{ flex: TABLE_COLUMNS.supply.flex, paddingRight: 0 }}
          >
            {rowData.supply.current === rowData.supply.max ? (
              rowData.supply.current
            ) : (
              <>
                {rowData.supply.current}
                <BrandText
                  style={[
                    isMobile ? fontSemibold11 : fontSemibold13,
                    {
                      color: neutral77,
                      marginHorizontal: 2,
                    },
                  ]}
                >
                  /
                </BrandText>
                {rowData.supply.max === -1 ? "∞" : rowData.supply.max}
              </>
            )}
          </InnerCell>
          <PrettyPriceWithCurrency
            data={rowData.mintVolume}
            style={{ flex: TABLE_COLUMNS.mintVolume.flex }}
          />
        </>
      )}
    </OmniLink>
  );
};

const InnerCell: React.FC<{
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: ReactNode;
}> = ({ children, style, textStyle }) => {
  const isMobile = useIsMobile();
  return (
    <View
      style={[
        {
          paddingRight: layout.spacing_x1,
        },
        style,
      ]}
    >
      <BrandText
        style={[isMobile ? fontSemibold11 : fontSemibold13, textStyle]}
        numberOfLines={1}
      >
        {children}
      </BrandText>
    </View>
  );
};

interface RowData {
  id: string;
  rank: number;
  collectionName?: string;
  collectionNameData: {
    collectionName?: string;
    image: string;
  };
  mintVolume: PrettyPrint;
  tradeVolume: PrettyPrint;
  TimePeriodPercentualVolume: string;
  sales: string;
  floorPrice: PrettyPrint;
  owners: string;
  supply: {
    max: number;
    current: number;
  };
}

const getRowData = (
  collection: PopularCollection,
  rank: number,
  prices: CoingeckoPrices,
): RowData => {
  const [network] = parseCollectionId(collection.id);
  const networkId = network?.id || "";
  const fp =
    collection.floorPrices.length > 0 ? collection.floorPrices[0] : undefined;
  const fpUsdValue = getCoingeckoPrice(
    networkId,
    fp?.denom || "",
    fp?.amount || "",
    prices,
  );
  const tv =
    collection.tradeVolumesByDenom.length > 0
      ? collection.tradeVolumesByDenom[0]
      : undefined;
  const mv =
    collection.mintVolumesByDenom.length > 0
      ? collection.mintVolumesByDenom[0]
      : undefined;
  return {
    id: collection.id,
    rank: rank + 1,
    collectionName: collection.name,
    collectionNameData: {
      collectionName: collection.name,
      image: collection.imageUri,
    },
    mintVolume: {
      networkId,
      usdValue: collection.mintUsdVolume,
      amount: mv?.amount || "0",
      denom: mv?.denom || "",
    },
    tradeVolume: {
      networkId,
      usdValue: collection.tradeUsdVolume,
      amount: tv?.amount || "0",
      denom: tv?.denom || "",
    },
    TimePeriodPercentualVolume: getDelta(collection),
    sales: prettyNumber(collection.tradesCount, 2),
    floorPrice: {
      networkId,
      amount: fp?.amount || "0",
      denom: fp?.denom || "",
      usdValue: fpUsdValue,
    },
    owners: prettyNumber(collection.ownersCount, 3),
    supply: {
      max: collection.maxSupply,
      current: collection.currentSupply,
    },
  };
};

const getDelta = (collection: PopularCollection) => {
  const diff = collection.tradeUsdVolume - collection.tradeUsdVolumePrev;
  if (diff === 0 || collection.tradeUsdVolumePrev === 0) {
    return "-";
  }
  const res = (diff / collection.tradeUsdVolumePrev) * 100;
  if (res > 0) {
    return "+" + res.toFixed(0) + "%";
  }
  return res.toFixed(0) + "%";
};

const usePopularCollections = (
  networkId: string | undefined,
  periodHours: number,
) => {
  return useQuery(["popular-collections", networkId, periodHours], async () => {
    const client = getMarketplaceClient(networkId);
    if (!client) {
      return [];
    }
    const collections: PopularCollection[] = [];
    await client
      .PopularCollections({ networkId, periodHours, limit: 100 })
      .forEach(({ collection }) => {
        if (!collection) {
          return;
        }
        collections.push(collection);
      });
    return collections;
  });
};
