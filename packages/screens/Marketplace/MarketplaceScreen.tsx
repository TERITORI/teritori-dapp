import React, { ReactNode, useState } from "react";
import { FlatList, StyleProp, TextStyle, View, ViewStyle } from "react-native";

import { PrettyPrint } from "./types";
import {
  Collection,
  MintState,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { CurrencyIcon } from "../../components/CurrencyIcon";
import { OmniLink } from "../../components/OmniLink";
import { Pagination } from "../../components/Pagination";
import { ScreenContainer } from "../../components/ScreenContainer";
import { RoundedGradientImage } from "../../components/images/RoundedGradientImage";
import { SearchInput } from "../../components/sorts/SearchInput";
import { SpacerColumn } from "../../components/spacer";
import { TableRow } from "../../components/table/TableRow";
import { Tabs } from "../../components/tabs/Tabs";
import { useCollections } from "../../hooks/useCollections";
import { useEnabledNetworks } from "../../hooks/useEnabledNetworks";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { NetworkFeature } from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import {
  errorColor,
  mineShaftColor,
  successColor,
} from "../../utils/style/colors";
import {
  fontSemibold11,
  fontSemibold13,
  fontSemibold20,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout, screenContentMaxWidthLarge } from "../../utils/style/layout";
import { numFormatter } from "../../utils/text";
import { arrayIncludes } from "../../utils/typescript";

const TABLE_ROWS = {
  rank: {
    label: "Rank",
    flex: 1,
  },
  collectionNameData: {
    label: "Collection",
    flex: 5,
  },
  totalVolume: {
    label: "Total Volume",
    flex: 3,
  },
  TimePeriodVolume: {
    label: "30d Volume",
    flex: 3,
  },
  TimePeriodPercentualVolume: {
    label: "30d % Volume",
    flex: 3,
  },
  sales: {
    label: "Sales",
    flex: 3,
  },
  floorPrice: {
    label: "Floor Price",
    flex: 3,
  },
  owners: {
    label: "Owners",
    flex: 3,
  },
  supply: {
    label: "Supply",
    flex: 3,
  },
};

export const MarketplaceScreen: ScreenFC<"Marketplace"> = () => {
  const navigation = useAppNavigation();
  const selectedNetworkId = useSelectedNetworkId();
  const enabledNetworks = useEnabledNetworks();

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

  const req = {
    networkId: selectedTab,
    sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
    upcoming: false,
    sort: Sort.SORT_VOLUME_USD,
    limit: 32,
    offset: 0,
    mintState: MintState.MINT_STATE_UNSPECIFIED,
  };

  const { collections: borkenCollections } = useCollections(req);

  // this is a hack, we need to fix these in the indexer but it's pain to replay due to current p2e implem and we need to fix this asap
  // FIXME
  const collections = borkenCollections.map((collection) => {
    let denom = collection.denom;
    let volumeDenom = collection.volumeDenom;
    switch (collection.id) {
      case "tori-tori1gflccmghzfscmxl95z43v36y0rle8v9x8kvt9na03yzywtw86amsj9nf37": // tori gen-1
      case "tori-tori167xst2jy9n6u92t3n8hf762adtpe3cs6acsgn0w5n2xlz9hv3xgs4ksc6t": // disease of the brain
      case "tori-tori1wkwy0xh89ksdgj9hr347dyd2dw7zesmtrue6kfzyml4vdtz6e5wscs7038": // tns
        denom = "utori";
        volumeDenom = denom;
        break;
    }
    return { ...collection, denom, volumeDenom };
  });

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
            flexDirection: "row",
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
          }}
        >
          <SearchInput
            style={{
              flex: 7,
            }}
            handleChangeText={handleChangeText}
          />
        </View>
        <CollectionTable rows={collections} filterText={filterText} />
      </View>
    </ScreenContainer>
  );
};

const CollectionTable: React.FC<{
  rows: Collection[];
  filterText: string;
}> = ({ rows, filterText }) => {
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [pageIndex, setPageIndex] = useState(0);
  const isMobile = useIsMobile();

  const filteredCollections = rows.filter(
    ({ collectionName }) =>
      collectionName?.toLowerCase().includes(filterText.toLowerCase()),
  );

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
            ? Object.values(TABLE_ROWS)
            : Object.values(TABLE_ROWS).slice(0, -5)
        }
      />
      <FlatList
        data={filteredCollections}
        renderItem={({ item, index }) => (
          <CollectionRow collection={item} rank={index} />
        )}
        keyExtractor={(item) => item.id}
        style={{
          minHeight: 248,
          borderTopColor: mineShaftColor,
          borderTopWidth: 1,
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
      <BrandText
        style={[
          isMobile ? fontSemibold11 : fontSemibold13,
          {
            marginRight: layout.spacing_x0_5,
          },
        ]}
        numberOfLines={1}
      >
        {prettyPrice(data.networkId, data.value.toString(10), data.denom)}
      </BrandText>
      <CurrencyIcon networkId={data.networkId} denom={data.denom} size={16} />
    </View>
  );
};

const CollectionRow: React.FC<{ collection: Collection; rank: number }> = ({
  collection,
  rank,
}) => {
  const rowData = useRowData(collection, rank);
  const isMobile = useIsMobile();

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
      to={{
        screen: collection.floorPrice !== 0 ? "Collection" : "MintCollection",
        params: { id: collection.id },
      }}
    >
      <InnerCell style={{ flex: TABLE_ROWS.rank.flex }}>
        {rowData.rank}
      </InnerCell>

      <View
        style={{
          flex: TABLE_ROWS.collectionNameData.flex,
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
          paddingRight: layout.spacing_x1,
        }}
      >
        <RoundedGradientImage
          size="XS"
          sourceURI={rowData.collectionNameData.image}
          style={{ marginRight: isMobile ? 8 : 30 }}
        />
        <BrandText style={isMobile ? fontSemibold11 : fontSemibold13}>
          {rowData.collectionNameData.collectionName}
        </BrandText>
      </View>
      <PrettyPriceWithCurrency
        data={rowData.totalVolume}
        style={{ flex: TABLE_ROWS.totalVolume.flex }}
      />
      <PrettyPriceWithCurrency
        data={rowData["TimePeriodVolume"]}
        style={{ flex: TABLE_ROWS.TimePeriodVolume.flex }}
      />
      {!isMobile && (
        <>
          <InnerCell
            style={{ flex: TABLE_ROWS.TimePeriodPercentualVolume.flex }}
            textStyle={{
              color: rowData["TimePeriodPercentualVolume"].includes("+")
                ? successColor
                : errorColor,
            }}
          >
            {rowData["TimePeriodPercentualVolume"]}
          </InnerCell>

          <InnerCell style={{ flex: TABLE_ROWS.sales.flex }}>
            {rowData.sales}
          </InnerCell>
          <PrettyPriceWithCurrency
            data={rowData.floorPrice}
            style={{ flex: TABLE_ROWS.floorPrice.flex }}
          />
          <InnerCell style={{ flex: TABLE_ROWS.owners.flex }}>
            {rowData.owners}
          </InnerCell>
          <InnerCell style={{ flex: TABLE_ROWS.supply.flex, paddingRight: 0 }}>
            {rowData.supply === "0" ? "No limit" : rowData.supply}
          </InnerCell>
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
  totalVolume: PrettyPrint;
  TimePeriodVolume: PrettyPrint;
  TimePeriodPercentualVolume: string;
  sales: string;
  floorPrice: PrettyPrint;
  owners: string;
  supply: string;
}

const useRowData = (collection: Collection, rank: number): RowData => {
  return {
    id: collection.id,
    rank: rank + 1,
    collectionName: collection.collectionName,
    collectionNameData: {
      collectionName: collection.collectionName,
      image: collection.imageUri,
    },
    totalVolume: {
      networkId: collection.networkId,
      value: collection.totalVolume,
      denom: collection.denom,
    },
    TimePeriodVolume: {
      networkId: collection.networkId,
      value: parseFloat(collection.volume),
      denom: collection.denom,
    },
    TimePeriodPercentualVolume: getDelta(collection),
    sales: numFormatter(collection.numTrades, 0),
    floorPrice: {
      networkId: collection.networkId,
      value: collection.floorPrice,
      denom: collection.denom,
    },
    owners: numFormatter(
      collection.numOwners,
      collection.numOwners.toString().length,
    ),
    supply: numFormatter(
      collection.maxSupply,
      collection.maxSupply.toString().length,
    ),
  };
};
const getDelta = (collection: Collection) => {
  if (collection.volume === "0") {
    return "-";
  }
  const res = (collection.volumeCompare * 100) / parseFloat(collection.volume);
  if (res > 100) {
    return "+" + res.toFixed(2) + "%";
  }
  return "-" + (100 - res).toFixed(2) + "%";
};
