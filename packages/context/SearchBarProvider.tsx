import { useQuery } from "@tanstack/react-query";
import React, { ReactNode, createContext, useContext, useState } from "react";
import { useSelector } from "react-redux";

import { Collection } from "../api/marketplace/v1/marketplace";
import { useNameSearch } from "../hooks/search/useNameSearch";
import { useSelectedNetworkId } from "../hooks/useSelectedNetwork";
import { selectSearchText } from "../store/slices/search";
import { getMarketplaceClient } from "../utils/backend";

interface SearchBarContextValue {
  isSearchModalMobileOpen: boolean;
  setSearchModalMobileOpen: (value: boolean) => void;
  names: string[];
  collections: Collection[];
  hasCollections: boolean;
  hasNames: boolean;
}

const defaultValue: SearchBarContextValue = {
  isSearchModalMobileOpen: false,
  setSearchModalMobileOpen: () => {},
  names: [],
  collections: [],
  hasCollections: false,
  hasNames: false,
};

const SearchBarContext = createContext(defaultValue);

export const SearchBarContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // The entered isSidebarExpanded
  const [isSearchModalMobileOpen, setSearchModalMobileOpen] = useState<boolean>(
    defaultValue.isSearchModalMobileOpen,
  );
  const selectedNetworkId = useSelectedNetworkId();
  const text = useSelector(selectSearchText);

  const { names } = useNameSearch({
    networkId: selectedNetworkId,
    input: text,
    limit: 12,
  });
  const hasNames = !!names.length;

  const { data: collections = [] } = useQuery(
    ["searchCollections", selectedNetworkId, text],
    async () => {
      if (!selectedNetworkId || !text) {
        return [];
      }
      const client = getMarketplaceClient(selectedNetworkId);
      if (!client) {
        return [];
      }
      const reply = await client.SearchCollections({
        input: text,
        limit: 6,
      });
      return reply.collections;
    },
    {
      staleTime: Infinity,
    },
  );
  const hasCollections = !!collections.length;

  return (
    <SearchBarContext.Provider
      value={{
        isSearchModalMobileOpen,
        setSearchModalMobileOpen,
        hasCollections,
        hasNames,
        names,
        collections,
      }}
    >
      {children}
    </SearchBarContext.Provider>
  );
};

export const useSearchBar = () => useContext(SearchBarContext);
