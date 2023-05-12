import React, { useState } from "react";
import { FlatList, View } from "react-native";

import {
  Collection,
  MintState,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
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
  collectionName: {
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
  const req = {
    networkId: selectedNetworkId,
    sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
    upcoming: false,
    sort: Sort.SORTING_VOLUME,
    limit: 32,
    offset: 0,
    mintState: MintState.MINT_STATE_UNSPECIFIED,
  };

  const [sortDirection, setSortDirection] = useState(
    SortDirection.SORT_DIRECTION_ASCENDING
  );
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabs>("teritori");
  const { collections } = useCollections(req);
  const [filteredCollections, setFilteredCollections] = useState(collections);

  const handleChangeText = (e: string) => {
    setFilteredCollections(
      collections.filter((value) =>
        value.collectionName.toLowerCase().includes(e.toLowerCase())
      )
    );
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
        <CollectionTable rows={filteredCollections} />
      </View>
    </ScreenContainer>
  );
};

const CollectionTable: React.FC<{
  rows: Collection[];
}> = ({ rows }) => {
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [pageIndex, setPageIndex] = useState(0);

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
        data={rows}
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
    </View>
  );
};

const CollectionRow: React.FC<{ collection: Collection; rank: number }> = ({
  collection,
  rank,
}) => {
  // const [network, txHash] = parseActivityId(colection.id);
  // const [, buyerAddress] = parseUserId(colection.buyerId);
  // const [, sellerAddress] = parseUserId(colection.sellerId);
  // const buyerInfo = useNSUserInfo(colection.buyerId);
  // const sellerInfo = useNSUserInfo(colection.sellerId);
  const { collectionInfo } = useCollectionInfo(collection.id);
  const stats = useCollectionStats(collection.id);

  return (
    <View
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
    >
      <InnerCell flex={1}>{rank + 1}</InnerCell>
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
          imageSource={{ uri: collectionInfo.image }}
          style={{ marginRight: 24 }}
        />
        <BrandText style={fontSemibold13}>{collectionInfo.name}</BrandText>
      </View>
      <InnerCell>{nFormatter(stats?.totalVolume, 2)}</InnerCell>
      <InnerCell>{nFormatter(stats?.totalVolume, 2)}</InnerCell>

      <InnerCell>{nFormatter(stats?.totalVolume, 2)}</InnerCell>

      <InnerCell>{nFormatter(stats?.totalVolume, 2)}</InnerCell>

      <InnerCell>{collectionInfo.prettyUnitPrice}</InnerCell>
      <InnerCell>
        {nFormatter(stats?.owners, stats?.owners.toString().length)}
      </InnerCell>
      <InnerCell>
        {nFormatter(stats?.totalSupply, stats?.totalSupply.toString().length)}
      </InnerCell>
    </View>
  );
};

const InnerCell: React.FC<{ flex: number }> = ({ flex = 3, children }) => {
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

function nFormatter(num: number, digits: number) {
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
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
}
