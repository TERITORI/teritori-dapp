import React, { useState } from "react";
import { FlatList, View } from "react-native";

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
import { TableRow, TableRowHeading } from "../../components/table";
import { Tabs } from "../../components/tabs/Tabs";
import { useCollections } from "../../hooks/useCollections";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { prettyPrice } from "../../utils/coins";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { mineShaftColor } from "../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold20,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout, screenContentMaxWidthLarge } from "../../utils/style/layout";

const TABLE_ROWS: { [key: string]: TableRowHeading } = {
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

  const tabs = {
    teritori: {
      name: "Teritori",
    },
    ethereum: {
      name: "Ethereum",
    },
  };
  const [selectedTab, setSelectedTab] =
    // @ts-expect-error
    useState<keyof typeof tabs>(selectedNetworkId);

  const req = {
    networkId: selectedTab,
    sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
    upcoming: false,
    sort: Sort.SORT_VOLUME,
    limit: 32,
    offset: 0,
    mintState: MintState.MINT_STATE_UNSPECIFIED,
  };

  const { collections } = useCollections(req);
  const [filterText, setFilterText] = useState("");

  const handleChangeText = (e: string) => {
    setFilterText(e);
  };
  return (
    <ScreenContainer
      footerChildren={<></>}
      headerChildren={
        <BrandText style={fontSemibold20}>NFT Marketplace</BrandText>
      }
      responsive
      onBackPress={() => navigation.navigate("Marketplace")}
    >
      <View
        style={{
          marginTop: layout.padding_x4,
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
            marginTop: layout.padding_x4,
            marginBottom: layout.padding_x4,
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

  const filteredCollections = rows.filter(({ collectionName }) =>
    collectionName?.toLowerCase().includes(filterText.toLowerCase())
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
      <TableRow headings={Object.values(TABLE_ROWS)} />
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

const PrettyPriceWithCurrency: React.FC<{ data: prettyPrint }> = ({ data }) => {
  return (
    <View
      style={{
        flex: 3,
        paddingRight: layout.padding_x1,
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "center",
      }}
    >
      <BrandText
        style={[
          fontSemibold13,
          {
            marginRight: layout.padding_x0_5,
          },
        ]}
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
  return (
    <OmniLink
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        borderColor: mineShaftColor,
        borderBottomWidth: 1,
        paddingVertical: layout.padding_x2,
        paddingHorizontal: layout.padding_x2_5,
      }}
      to={{ screen: "Collection", params: { id: collection.id } }}
    >
      <InnerCell flex={1}>{rowData.rank}</InnerCell>
      <View
        style={{
          flex: 5,
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
          paddingRight: layout.padding_x1,
        }}
      >
        <RoundedGradientImage
          size="XS"
          imageSource={{ uri: rowData.collectionNameData.image }}
          style={{ marginRight: 24 }}
        />
        <BrandText style={fontSemibold13}>
          {rowData.collectionNameData.collectionName}
        </BrandText>
      </View>
      <PrettyPriceWithCurrency data={rowData.totalVolume} />
      <PrettyPriceWithCurrency data={rowData["TimePeriodVolume"]} />
      <InnerCell>{rowData["TimePeriodPercentualVolume"]}</InnerCell>
      <InnerCell>{rowData.sales}</InnerCell>
      <PrettyPriceWithCurrency data={rowData.floorPrice} />
      <InnerCell>{rowData.owners}</InnerCell>
      <InnerCell>{rowData.supply}</InnerCell>
    </OmniLink>
  );
};

const InnerCell: React.FC<{ flex?: number }> = ({ flex = 3, children }) => {
  return (
    <View
      style={{
        flex,
        paddingRight: layout.padding_x1,
      }}
    >
      <BrandText style={fontSemibold13} numberOfLines={1}>
        {children}
      </BrandText>
    </View>
  );
};

function nFormatter(
  num: number | undefined | string,
  digits: number | undefined
) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      // @ts-expect-error
      return num >= item.value;
    });

  return item
    ? // @ts-expect-error
      (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
}

interface prettyPrint {
  networkId: string;
  value: number;
  denom: string;
}

interface RowData {
  id: string;
  rank: number;
  collectionName?: string;
  collectionNameData: {
    collectionName?: string;
    image?: string;
  };
  totalVolume: prettyPrint;
  TimePeriodVolume: prettyPrint;
  TimePeriodPercentualVolume: number;
  sales: string;
  floorPrice: prettyPrint;
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
    TimePeriodPercentualVolume: collection.comparison,
    sales: nFormatter(collection.numTrades, 0),
    floorPrice: {
      networkId: collection.networkId,
      value: collection.floorPrice,
      denom: collection.denom,
    },
    owners: nFormatter(
      collection.numOwners,
      collection.numOwners.toString().length
    ),
    supply: nFormatter(
      collection.maxSupply,
      collection.maxSupply.toString().length
    ),
  };
};
