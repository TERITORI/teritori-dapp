import React from "react";

import { NetworkIcon } from "./../../../components/NetworkIcon";

import defaultCollectionImagePNG from "@/assets/default-images/ava.png";
import checkBadgeSVG from "@/assets/icons/certified.svg";
import { SVG } from "@/components/SVG";
import { RoundedGradientImage } from "@/components/images/RoundedGradientImage";
import { SpacerRow } from "@/components/spacer";
import { TableCell } from "@/components/table/TableCell";
import { CellBrandText, TableTextCell } from "@/components/table/TableTextCell";
import { TableColumns } from "@/components/table/utils";
import { getNetwork } from "@/networks";
import { web3ToWeb2URI } from "@/utils/ipfs";
import { layout } from "@/utils/style/layout";
import { CollectionDataResult } from "@/utils/types/launchpad";

export const commonColumns: TableColumns = {
  rank: {
    label: "#",
    minWidth: 20,
    flex: 0.25,
  },
  collectionName: {
    label: "Collection Name",
    minWidth: 240,
    flex: 3,
  },
  symbol: {
    label: "Symbol",
    minWidth: 80,
    flex: 0.5,
  },
  collectionNetwork: {
    label: "Collection Network",
    minWidth: 150,
    flex: 1.8,
  },
};

export const LaunchpadTablesCommonColumns: React.FC<{
  collectionData: CollectionDataResult;
  index: number;
}> = ({ collectionData, index }) => {
  const network = getNetwork(collectionData.target_network);

  // console.log('network.icon', network.icon)

  return (
    <>
      <TableTextCell
        style={{
          minWidth: commonColumns.rank.minWidth,
          flex: commonColumns.rank.flex,
        }}
      >
        {`${index + 1}`}
      </TableTextCell>

      <TableCell
        style={{
          minWidth: commonColumns.collectionName.minWidth,
          flex: commonColumns.collectionName.flex,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <RoundedGradientImage
          size="XS"
          sourceURI={web3ToWeb2URI(collectionData.cover_img_uri)}
          fallbackURI={defaultCollectionImagePNG}
          style={{
            marginRight: layout.spacing_x1,
          }}
        />
        <CellBrandText>{collectionData.name}</CellBrandText>

        <SVG
          source={checkBadgeSVG}
          width={18}
          height={18}
          style={{ marginLeft: layout.spacing_x1 }}
        />
      </TableCell>

      <TableTextCell
        style={{
          minWidth: commonColumns.symbol.minWidth,
          flex: commonColumns.symbol.flex,
        }}
      >
        {collectionData.symbol}
      </TableTextCell>

      <TableCell
        style={{
          minWidth: commonColumns.collectionNetwork.minWidth,
          flex: commonColumns.collectionNetwork.flex,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <NetworkIcon networkId={collectionData.target_network} size={18} />
        <SpacerRow size={1} />
        <CellBrandText>
          {network?.displayName || "UNKNOWN NETWORK"}
        </CellBrandText>
      </TableCell>
    </>
  );
};
