import {cloneDeep} from "lodash";
import React, {FC, ReactNode, useMemo, useState} from "react";
import {FlatList, Platform, ScrollView, StyleProp, TextStyle, View, ViewStyle,} from "react-native";
import {useSelector} from "react-redux";

import {PopularCollection} from "@/api/marketplace/v1/marketplace";
import {BrandText} from "@/components/BrandText";
import {CurrencyIcon} from "@/components/CurrencyIcon";
import {OmniLink} from "@/components/OmniLink";
import {Pagination} from "@/components/Pagination";
import {RoundedGradientImage} from "@/components/images/RoundedGradientImage";
import {SpacerColumn} from "@/components/spacer";
import {TableColumns, TableHeaderNew,} from "@/components/table/TableHeaderNew";
import {useCoingeckoPrices} from "@/hooks/useCoingeckoPrices";
import {useIsMobile} from "@/hooks/useIsMobile";
import {useMaxResolution} from "@/hooks/useMaxResolution";
import {useCollectionNavigationTarget} from "@/hooks/useNavigateToCollection";
import {parseCollectionId} from "@/networks";
import {selectTimePeriod} from "@/store/slices/marketplaceFilters";
import {CoingeckoCoin, CoingeckoPrices, getCoingeckoPrice,} from "@/utils/coingecko";
import {prettyPrice} from "@/utils/coins";
import {prettyNumber} from "@/utils/numbers";
import {errorColor, mineShaftColor, neutral77, successColor,} from "@/utils/style/colors";
import {fontSemibold11, fontSemibold13, fontSemibold9,} from "@/utils/style/fonts";
import {layout, screenContentMaxWidth, screenContentMaxWidthLarge,} from "@/utils/style/layout";
import {PrettyPrint} from "@/utils/types/marketplace";

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

const staticColumns: TableColumns = {
  rank: {
    label: "#",
    minWidth: 20,
    flex: 0.25,
  },
  collectionNameData: {
    label: "Collection",
    minWidth: 144,
    flex: 3,
  },
};

const scrollableColumns: TableColumns = {
  tradeVolume: {
    label: "",
    minWidth: 160,
    flex: 1.8,
  },
  tradeVolumeDiff: {
    label: "",
    minWidth: 80,
    flex: 1,
  },
  sales: {
    label: "",
    minWidth: 60,
    flex: 1,
  },
  floorPrice: {
    label: "Floor Price",
    minWidth: 160,
    flex: 1.8,
  },
  owners: {
    label: "Owners",
    minWidth: 60,
    flex: 1,
  },
  supply: {
    label: "Supply",
    minWidth: 80,
    flex: 1,
  },
  mintVolume: {
    label: "",
    minWidth: 160,
    flex: 1.8,
  },
};

export const CollectionTable: FC<{
  rows: PopularCollection[];
  filterText: string;
}> = ({ rows, filterText }) => {
  const { width } = useMaxResolution();

  const [hoveredRowRank, setHoveredRowRank] = useState<number>();

  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [pageIndex, setPageIndex] = useState(0);
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
              acc[key] = {
                networkId: network.id,
                denom: fp.denom,
              };
            });
            return acc;
          },
          {} as Record<string, CoingeckoCoin>,
        ),
      ),
    [rows],
  );

  const { prices: floorPrices } = useCoingeckoPrices(floorCoins);

  const maxPage = Math.max(Math.ceil(rows.length / itemsPerPage), 1);

  return (
    <View
      style={{
        justifyContent: "space-between",
        width: "100%",
        maxWidth: screenContentMaxWidthLarge,
      }}
    >
      <View style={{ flexDirection: "row", width: "100%" }}>
        <View>
          <StaticHeader />

          <FlatList
            scrollEnabled={Platform.OS === "web"}
            data={rows}
            renderItem={({ item, index }) => (
              <StaticRow
                collection={item}
                rank={index}
                prices={floorPrices}
                onHover={(isHovered, rowRank) => {
                  if (isHovered) setHoveredRowRank(rowRank);
                }}
                isHovered={hoveredRowRank === index}
              />
            )}
            keyExtractor={(item) => item.id}
            style={{
              minHeight: 248,
              borderTopColor: mineShaftColor,
              borderTopWidth: 1,
              minWidth: 200,
            }}
            contentContainerStyle={{
              paddingBottom: 150, //just to make last element visible on mobile
            }}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            {
              justifyContent: "space-between",
            },
            width >= screenContentMaxWidth && { width: "100%" },
          ]}
        >
          <View
            style={{
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <ScrollableHeader />

            <FlatList
              scrollEnabled={Platform.OS === "web"}
              data={rows}
              renderItem={({ item, index }) => (
                <ScrollableRow
                  collection={item}
                  rank={index}
                  prices={floorPrices}
                  onHover={(isHovered, rowRank) => {
                    if (isHovered) setHoveredRowRank(rowRank);
                  }}
                  isHovered={hoveredRowRank === index}
                />
              )}
              keyExtractor={(item) => item.id}
              style={{
                minHeight: 248,
                width: "100%",
                borderTopColor: mineShaftColor,
                borderTopWidth: 1,
              }}
              contentContainerStyle={{
                paddingBottom: 150, //just to make last element visible on mobile
              }}
            />
          </View>
        </ScrollView>
      </View>

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

const StaticHeader: FC = () => {
  const isMobile = useIsMobile();
  return (
    <TableHeaderNew
      columns={staticColumns}
      style={{
        paddingLeft: isMobile ? layout.spacing_x1 : layout.spacing_x2_5,
        borderTopRightRadius: 0,
      }}
    />
  );
};

const ScrollableHeader: FC = () => {
  const timePeriod = useSelector(selectTimePeriod);
  const fixedScrollableColumns = cloneDeep(scrollableColumns);
  fixedScrollableColumns.tradeVolume.label =
    timePeriod.shortLabel + " Trade Volume";
  fixedScrollableColumns.mintVolume.label =
    timePeriod.shortLabel + " Mint Volume";
  fixedScrollableColumns.sales.label = timePeriod.shortLabel + " Sales";
  fixedScrollableColumns.tradeVolumeDiff.label =
    timePeriod.shortLabel + " Trade %";

  return (
    <TableHeaderNew
      columns={fixedScrollableColumns}
      style={{
        marginRight: layout.spacing_x1,
        borderTopLeftRadius: 0,
      }}
    />
  );
};

const StaticRow: React.FC<{
  collection: PopularCollection;
  rank: number;
  prices: CoingeckoPrices;
  onHover: (isHovered: boolean, rowRank: number) => void;
  isHovered: boolean;
}> = ({ collection, rank, prices, onHover, isHovered }) => {
  const rowData = getRowData(collection, rank, prices);
  const isMobile = useIsMobile();
  const target = useCollectionNavigationTarget(collection.id);

  return (
    <OmniLink
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderColor: mineShaftColor,
        borderBottomWidth: 1,
        paddingHorizontal: isMobile ? layout.spacing_x1 : layout.spacing_x2_5,
        height: 50,
      }}
      disabled={!target}
      to={{
        screen: target || "",
        params: { id: collection.id },
      }}
      onHover={(isHovered) => onHover(isHovered, rank)}
      isHovered={isHovered}
    >
      <InnerCell
        style={{
          minWidth: staticColumns.rank.minWidth * (isMobile ? 0.9 : 1),
          flex: staticColumns.rank.flex,
        }}
      >
        {rowData.rank}
      </InnerCell>

      <View
        style={{
          minWidth:
            staticColumns.collectionNameData.minWidth * (isMobile ? 0.9 : 1),
          flex: staticColumns.collectionNameData.flex,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <RoundedGradientImage
          size="XS"
          sourceURI={rowData.collectionNameData.image}
          style={{
            marginRight: isMobile ? layout.spacing_x1 : layout.spacing_x1_5,
          }}
        />
        <BrandText
          style={isMobile ? fontSemibold11 : fontSemibold13}
          numberOfLines={1}
        >
          {rowData.collectionNameData.collectionName}
        </BrandText>
      </View>
    </OmniLink>
  );
};

const ScrollableRow: React.FC<{
  collection: PopularCollection;
  rank: number;
  prices: CoingeckoPrices;
  onHover: (isHovered: boolean, rowRank: number) => void;
  isHovered: boolean;
}> = ({ collection, rank, prices, onHover, isHovered }) => {
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
        height: 50,
      }}
      disabled={!target}
      to={{
        screen: target || "",
        params: { id: collection.id },
      }}
      onHover={(isHovered) => onHover(isHovered, rank)}
      isHovered={isHovered}
    >
      <PrettyPriceWithCurrency
        data={rowData["tradeVolume"]}
        style={{
          minWidth:
            scrollableColumns.tradeVolume.minWidth * (isMobile ? 0.9 : 1),
          flex: scrollableColumns.tradeVolume.flex,
        }}
      />
      <InnerCell
        style={{
          minWidth:
            scrollableColumns.tradeVolumeDiff.minWidth * (isMobile ? 0.9 : 1),
          flex: scrollableColumns.tradeVolumeDiff.flex,
        }}
        textStyle={{
          color: tradeDiffColor,
        }}
      >
        {tradeDiffText}
      </InnerCell>

      <InnerCell
        style={{
          minWidth: scrollableColumns.sales.minWidth * (isMobile ? 0.9 : 1),
          flex: scrollableColumns.sales.flex,
        }}
      >
        {rowData.sales}
      </InnerCell>

      <PrettyPriceWithCurrency
        data={rowData.floorPrice}
        style={{
          minWidth:
            scrollableColumns.floorPrice.minWidth * (isMobile ? 0.9 : 1),
          flex: scrollableColumns.floorPrice.flex,
        }}
      />
      <InnerCell
        style={{
          minWidth: scrollableColumns.owners.minWidth * (isMobile ? 0.9 : 1),
          flex: scrollableColumns.owners.flex,
        }}
      >
        {rowData.owners}
      </InnerCell>
      <InnerCell
        style={{
          minWidth: scrollableColumns.supply.minWidth * (isMobile ? 0.9 : 1),
          flex: scrollableColumns.supply.flex,
        }}
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
        style={{
          minWidth:
            scrollableColumns.mintVolume.minWidth * (isMobile ? 0.9 : 1),
          flex: scrollableColumns.mintVolume.flex,
        }}
      />
    </OmniLink>
  );
};

const InnerCell: FC<{
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: ReactNode;
}> = ({ children, style, textStyle }) => {
  const isMobile = useIsMobile();
  return (
    <View
      style={[
        {
          marginRight: layout.spacing_x1,
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

const PrettyPriceWithCurrency: React.FC<{
  data: PrettyPrint;
  style?: StyleProp<ViewStyle>;
}> = ({ data, style }) => {
  const isMobile = useIsMobile();

  return (
    <View
      style={[
        {
          marginRight: layout.spacing_x1,
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
                  marginLeft: layout.spacing_x1,
                  color: neutral77,
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
