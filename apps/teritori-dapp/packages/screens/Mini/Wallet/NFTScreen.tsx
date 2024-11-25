import { useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { NFTAccordion } from "./components/NFTAccordion";
import searchSvg from "@/assets/icons/search-gray.svg";
import MiniTextInput from "../components/MiniTextInput";

import {
  MintState,
  Sort,
  SortDirection,
} from "@/api/marketplace/v1/marketplace";
import { SpacerColumn } from "@/components/spacer";
import { useCollections } from "@/hooks/useCollections";
import { useSelectedNativeWallet } from "@/hooks/wallet/useSelectedNativeWallet";
import { parseNetworkObjectId } from "@/networks";
import { ScreenFC } from "@/utils/navigation";
import { neutralA3 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const NFTScreen: ScreenFC<"MiniWallets"> = ({ navigation }) => {
  const selectedWallet = useSelectedNativeWallet();
  const userId = `tori-${selectedWallet?.address}`;
  const [network] = parseNetworkObjectId(userId);
  const networkId = network?.id || "";
  const { collections } = useCollections({
    networkId,
    sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
    upcoming: false,
    sort: Sort.SORT_VOLUME,
    limit: 100,
    offset: 0,
    mintState: MintState.MINT_STATE_UNSPECIFIED,
  }); // FIXME: add owner filter and pagination
  const [filterText, setFilterText] = useState("");

  return (
    <View style={{ flex: 1 }}>
      <MiniTextInput
        placeholder="Search"
        icon={searchSvg}
        style={{
          backgroundColor: "rgba(118, 118, 128, 0.24)",
          paddingVertical: layout.spacing_x1,
        }}
        value={filterText}
        onChangeText={setFilterText}
        inputStyle={[fontSemibold14, { lineHeight: 0 }]}
        placeholderTextColor={neutralA3}
      />

      <SpacerColumn size={1} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={collections.filter((collection) =>
          collection.collectionName
            .toLowerCase()
            .includes(filterText.toLowerCase()),
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <>
            <NFTAccordion index={index} ownerId={userId} collection={item} />
          </>
        )}
      />
    </View>
  );
};

export default NFTScreen;
