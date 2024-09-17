import React, { useState } from "react";
import { FlatList, View } from "react-native";

import { screenContentMaxWidthLarge } from "@/utils/style/layout";

import { TableHeader } from "@/components/table/TableHeader";
import { TableRow } from "@/components/table/TableRow";
import { TableTextCell } from "@/components/table/TableTextCell";
import { TableWrapper } from "@/components/table/TableWrapper";
import { TableColumns } from "@/components/table/utils";
import { useIsMobile } from "@/hooks/useIsMobile";

const columns: TableColumns = {
    symbol: {
        label: "Symbol",
        flex: 0.65,
        minWidth: 110,
    },
    name: {
        label: "Name",
        flex: 0.65,
        minWidth: 140,
    },
    decimals: {
        label: "Decimals",
        flex: 0.65,
        minWidth: 100,
    },
    totalSupply: {
        label: "Total Supply",
        flex: 1.5,
        minWidth: 180,
    },
    mintable: {
        label: "Mintable",
        flex: 1.25,
        minWidth: 70,
    },
    burnable: {
        label: "Burnable",
        flex: 1.25,
        minWidth: 70,
    },
};

const breakpointM = 800;

export const TokensTable: React.FC<{}> = () => {
    const [pageIndex, setPageIndex] = useState(0);
    // replace by useTokens hook
    const tokens = [{
        id: "1",
        symbol: "ETH",
        name: "Ethereum",
        decimals: 18,
        totalSupply: "120000000",
        mintable: true,
        burnable: true,
    },
    {
        id: "2",
        symbol: "BTC",
        name: "Bitcoin",
        decimals: 8,
        totalSupply: "21000000",
        mintable: false,
        burnable: false
    }]

    return (
        <View
            style={{
                width: "100%",
                maxWidth: screenContentMaxWidthLarge,
            }}
        >
            <TableWrapper
                paginationProps={{
                    currentPage: pageIndex,
                    maxPage: 1,
                    itemsPerPage: 10,
                    nbItemsOptions: [],
                    setItemsPerPage: () => { },
                    onChangePage: () => { },
                }}
                horizontalScrollBreakpoint={breakpointM}
            >
                <TableHeader columns={columns} />
                <FlatList
                    data={tokens}
                    renderItem={({ item }) => <TokenTableRow token={item} />}
                    keyExtractor={(item) => item.id}
                />
            </TableWrapper>
        </View>
    );
};

export interface Token {
    id: string;
    symbol: string;
    name: string;
    decimals: number;
    totalSupply: string;
    mintable: boolean;
    burnable: boolean;
}

const TokenTableRow: React.FC<{
    token: Token;
}> = ({ token }) => {
    const isMobile = useIsMobile();

    return (
        <TableRow>
            <TableTextCell
                style={[
                    {
                        minWidth: columns.symbol.minWidth,
                        flex: columns.symbol.flex,
                    },
                ]}
            >
                {prettySymbol(token.symbol)}
            </TableTextCell>

            <TableTextCell
                style={[
                    {
                        minWidth: columns.name.minWidth,
                        flex: columns.name.flex,
                    },
                ]}
            >
                {prettyName(token.name)}
            </TableTextCell>
            <TableTextCell
                style={[
                    {
                        minWidth: columns.decimals.minWidth,
                        flex: columns.decimals.flex,
                    },
                ]}
            >
                {token.decimals.toString()}
            </TableTextCell>

            <TableTextCell
                style={[
                    {
                        minWidth: columns.totalSupply.minWidth,
                        flex: columns.totalSupply.flex,
                    },
                ]}
            >
                {prettySupply(token.totalSupply, token.symbol)}
            </TableTextCell>
            <TableTextCell
                style={[
                    {
                        minWidth: columns.mintable.minWidth,
                        flex: columns.mintable.flex,
                    },
                ]}
            >
                {token.mintable ? "Yes" : "No"}
            </TableTextCell>
            <TableTextCell
                style={[
                    {
                        minWidth: columns.burnable.minWidth,
                        flex: columns.burnable.flex,
                    },
                ]}
            >
                {token.burnable ? "Yes" : "No"}
            </TableTextCell>
        </TableRow>
    );
};

const prettySupply = (supply: string, symbol: string) => {
    return supply.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + symbol;
}

const prettySymbol = (symbol: string) => {
    return symbol.length > 4 ? symbol.slice(0, 4) + "..." : symbol;
}

const prettyName(symbol: string, name: string) {
    return name.length > 15 ? name.slice(0, 15) + "..." : name;
}


