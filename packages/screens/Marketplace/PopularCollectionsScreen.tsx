import React, { useState } from "react";
import { FlatList, View } from "react-native";

import {
  Collection,
  MintState,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { OmniLink } from "../../components/OmniLink";
import { Pagination } from "../../components/Pagination";
import { ScreenContainer } from "../../components/ScreenContainer";
import { RoundedGradientImage } from "../../components/images/RoundedGradientImage";
import { SearchInput } from "../../components/sorts/SearchInput";
import { SortButton } from "../../components/sorts/SortButton";
import { SpacerColumn } from "../../components/spacer";
import { TableRow, TableRowHeading } from "../../components/table";
import { Tabs } from "../../components/tabs/Tabs";
import { useCollectionInfo } from "../../hooks/useCollectionInfo";
import { useCollectionStats } from "../../hooks/useCollectionStats";
import { useCollections } from "../../hooks/useCollections";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { mineShaftColor, neutral33 } from "../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold20,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout, screenContentMaxWidth } from "../../utils/style/layout";

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
  "24hVolume": {
    label: "24h Volume",
    flex: 3,
  },
  "24hPercentualVolume": {
    label: "24h % Volume",
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

export const PopularCollectionsScreen: ScreenFC<"PopularCollections"> = () => {
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

  const [sortDirection, setSortDirection] = useState(
    SortDirection.SORT_DIRECTION_ASCENDING
  );
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
              flex: 6,
              marginRight: layout.padding_x2,
            }}
            handleChangeText={handleChangeText}
          />
          <SortButton
            style={{
              flex: 1,
            }}
            height={38}
            mainContainerStyle={{ backgroundColor: neutral33 }}
            sortDirection={sortDirection}
            onChangeSortDirection={setSortDirection}
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
        maxWidth: screenContentMaxWidth,
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

const CollectionRow: React.FC<{ collection: Collection; rank: number }> = ({
  collection,
  rank,
}) => {
  const rowData = useRowData(collection.id, rank);
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
      <InnerCell>{rowData.totalVolume}</InnerCell>
      <InnerCell>{rowData["24hVolume"]}</InnerCell>
      <InnerCell>{rowData["24hPercentualVolume"]}</InnerCell>
      <InnerCell>{rowData.sales}</InnerCell>
      <InnerCell>{rowData.floorPrice}</InnerCell>
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
interface RowData {
  id: string;
  rank: number;
  collectionName?: string;
  collectionNameData: {
    collectionName?: string;
    image?: string;
  };
  totalVolume: string;
  "24hVolume": string;
  "24hPercentualVolume": string;
  sales: string;
  floorPrice?: string;
  owners: string;
  supply: string;
}

const useRowData = (id: string, rank: number): RowData => {
  const { collectionInfo } = useCollectionInfo(id);
  const stats = useCollectionStats(id);

  return {
    id,
    rank: rank + 1,
    collectionName: collectionInfo.name,
    collectionNameData: {
      collectionName: collectionInfo.name,
      image: collectionInfo.image,
    },
    totalVolume: nFormatter(stats?.totalVolume, 0),
    "24hVolume": nFormatter(stats?.totalVolume, 0),
    "24hPercentualVolume": nFormatter(stats?.totalVolume, 2),
    sales: nFormatter(stats?.totalVolume, 0),
    floorPrice: collectionInfo.prettyUnitPrice,
    owners: nFormatter(stats?.owners, stats?.owners.toString().length),
    supply: nFormatter(
      stats?.totalSupply,
      stats?.totalSupply.toString().length
    ),
  };
};
