import { cloneDeep } from "lodash";
import React, { FC, useMemo, useState } from "react";
import { FlatList, StyleProp, View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import { PopularCollection } from "@/api/marketplace/v1/marketplace";
import { BrandText } from "@/components/BrandText";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import { OmniLink } from "@/components/OmniLink";
import { RoundedGradientImage } from "@/components/images/RoundedGradientImage";
import { SpacerRow } from "@/components/spacer";
import { TableCell } from "@/components/table/TableCell";
import { TableHeader } from "@/components/table/TableHeader";
import { TableRow } from "@/components/table/TableRow";
import { CellBrandText, TableTextCell } from "@/components/table/TableTextCell";
import { TableWrapper } from "@/components/table/TableWrapper";
import { tableCellTextStyle, TableColumns } from "@/components/table/utils";
import { useCoingeckoPrices } from "@/hooks/useCoingeckoPrices";
import { useCollectionNavigationTarget } from "@/hooks/useNavigateToCollection";
import { parseCollectionId } from "@/networks";
import { selectTimePeriod } from "@/store/slices/marketplaceFilters";
import {
  CoingeckoCoin,
  CoingeckoPrices,
  getCoingeckoPrice,
} from "@/utils/coingecko";
import { prettyPrice } from "@/utils/coins";
import { prettyNumber } from "@/utils/numbers";
import { errorColor, neutral77, successColor } from "@/utils/style/colors";
import { layout, screenContentMaxWidthLarge } from "@/utils/style/layout";
import { PrettyPrint } from "@/utils/types/marketplace";

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

const columns: TableColumns = {
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

const breakpointM = 1092;

export const CollectionsTable: FC<{
  collections: PopularCollection[];
  filterText: string;
}> = ({ collections, filterText }) => {
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [pageIndex, setPageIndex] = useState(0);
  const filteredCollections = collections.filter((collection) =>
    collection.name?.toLowerCase().includes(filterText.toLowerCase()),
  );

  const floorCoins = useMemo(
    () =>
      Object.values(
        filteredCollections.reduce(
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
    [filteredCollections],
  );

  const { prices: floorPrices } = useCoingeckoPrices(floorCoins);

  const maxPage = Math.max(
    Math.ceil(filteredCollections.length / itemsPerPage),
    1,
  );

  const timePeriod = useSelector(selectTimePeriod);
  const fixedColumns = cloneDeep(columns);
  fixedColumns.tradeVolume.label = timePeriod.shortLabel + " Trade Volume";
  fixedColumns.mintVolume.label = timePeriod.shortLabel + " Mint Volume";
  fixedColumns.sales.label = timePeriod.shortLabel + " Sales";
  fixedColumns.tradeVolumeDiff.label = timePeriod.shortLabel + " Trade %";

  return (
    <View
      style={{
        width: "100%",
        maxWidth: screenContentMaxWidthLarge,
      }}
    >
      <TableWrapper
        showPagination={filteredCollections.length > 50}
        paginationProps={{
          currentPage: pageIndex,
          maxPage,
          itemsPerPage,
          nbItemsOptions: [50, 100, 200],
          setItemsPerPage,
          onChangePage: setPageIndex,
        }}
        horizontalScrollBreakpoint={breakpointM}
      >
        <TableHeader columns={fixedColumns} />
        <FlatList
          data={filteredCollections}
          renderItem={({ item, index }) => (
            <CollectionTableRow
              collection={item}
              index={index}
              prices={floorPrices}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </TableWrapper>
    </View>
  );
};

const CollectionTableRow: React.FC<{
  collection: PopularCollection;
  index: number;
  prices: CoingeckoPrices;
}> = ({ collection, index, prices }) => {
  const rowData = getRowData(collection, index, prices);
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
      disabled={!target}
      to={{
        screen: target || "",
        params: { id: collection.id },
      }}
    >
      <TableRow>
        <TableTextCell
          style={{
            minWidth: columns.rank.minWidth,
            flex: columns.rank.flex,
          }}
        >
          {`${rowData.rank}`}
        </TableTextCell>

        <TableCell
          style={{
            minWidth: columns.collectionNameData.minWidth,
            flex: columns.collectionNameData.flex,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <RoundedGradientImage
            size="XS"
            sourceURI={rowData.collectionNameData.image}
            style={{
              marginRight: layout.spacing_x1,
            }}
          />
          <CellBrandText>
            {rowData.collectionNameData.collectionName}
          </CellBrandText>
        </TableCell>

        <TableCell
          style={{
            minWidth: columns.tradeVolume.minWidth,
            flex: columns.tradeVolume.flex,
          }}
        >
          <PrettyPriceWithCurrency data={rowData["tradeVolume"]} />
        </TableCell>

        <TableTextCell
          style={{
            minWidth: columns.tradeVolumeDiff.minWidth,
            flex: columns.tradeVolumeDiff.flex,
          }}
          textStyle={{
            color: tradeDiffColor,
          }}
        >
          {tradeDiffText}
        </TableTextCell>

        <TableTextCell
          style={{
            minWidth: columns.sales.minWidth,
            flex: columns.sales.flex,
          }}
        >
          {rowData.sales}
        </TableTextCell>

        <TableCell
          style={{
            minWidth: columns.floorPrice.minWidth,
            flex: columns.floorPrice.flex,
          }}
        >
          <PrettyPriceWithCurrency data={rowData.floorPrice} />
        </TableCell>

        <TableTextCell
          style={{
            minWidth: columns.owners.minWidth,
            flex: columns.owners.flex,
          }}
        >
          {rowData.owners}
        </TableTextCell>

        <TableCell
          style={{
            minWidth: columns.supply.minWidth,
            flex: columns.supply.flex,
          }}
        >
          {rowData.supply.current === rowData.supply.max ? (
            <CellBrandText>{`${rowData.supply.current}`}</CellBrandText>
          ) : (
            <>
              <CellBrandText>{`${rowData.supply.current}`}</CellBrandText>
              <SpacerRow size={0.25} />
              <CellBrandText style={{ color: neutral77 }}>/</CellBrandText>
              <SpacerRow size={0.25} />
              <CellBrandText>
                {`${rowData.supply.max === -1 ? "∞" : rowData.supply.max}`}
              </CellBrandText>
            </>
          )}
        </TableCell>

        <TableCell
          style={{
            minWidth: columns.mintVolume.minWidth,
            flex: columns.mintVolume.flex,
          }}
        >
          <PrettyPriceWithCurrency data={rowData.mintVolume} />
        </TableCell>
      </TableRow>
    </OmniLink>
  );
};

const PrettyPriceWithCurrency: React.FC<{
  data: PrettyPrint;
  style?: StyleProp<ViewStyle>;
}> = ({ data, style }) => {
  return (
    <View
      style={[
        {
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
              // isMobile ? fontSemibold11 : fontSemibold13,
              tableCellTextStyle,
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
                // isMobile ? fontSemibold9 : fontSemibold11,
                tableCellTextStyle,
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
            // isMobile ? fontSemibold11 : fontSemibold13,
            tableCellTextStyle,
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
  index: number,
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
    rank: index + 1,
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
