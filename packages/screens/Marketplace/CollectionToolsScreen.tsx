import { useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { useCollectionInfoHeader } from "../../hooks/useCollectionInfoHeader";
import { parseNetworkObjectId } from "../../networks";
import { getMarketplaceClient } from "../../utils/backend";
import { ScreenFC } from "../../utils/navigation";
import {
  snapshotCollectionOGs,
  snapshotCollectionOwners,
  snapshotCollectionOwnersWithIds,
} from "../../utils/snapshots";

// FIXME: support native

const SnapshotEntry: React.FC<{
  snapshotFunc: () => Promise<any>;
  name: string;
  style?: StyleProp<ViewStyle>;
}> = ({ snapshotFunc, name, style }) => {
  const [data, setData] = useState("");
  return (
    <View style={[{ flexDirection: "row" }, style]}>
      <PrimaryButton
        text={`Snapshot ${name}`}
        style={{ marginRight: 20 }}
        size="M"
        onPress={async () => {
          const data = JSON.stringify(await snapshotFunc(), null, 2);
          setData(data);
        }}
        loader
      />
      {!!data && (
        <View style={{ justifyContent: "center" }}>
          <a
            href={`data:application/json,${encodeURIComponent(data)}`}
            download={`${name} ${new Date().toISOString()}.json`}
          >
            Download {name} snapshot
          </a>
        </View>
      )}
    </View>
  );
};

export const CollectionToolsScreen: ScreenFC<"CollectionTools"> = ({
  route: {
    params: { id },
  },
}) => {
  const { info: collectionInfoHeader } = useCollectionInfoHeader(id);
  const [network] = parseNetworkObjectId(id);
  const backendClient = getMarketplaceClient(network?.id);
  return (
    <ScreenContainer fullWidth footerChildren={<></>} noMargin noScroll>
      <View style={{ margin: 40 }}>
        <SnapshotEntry
          name={`Count by owners ${collectionInfoHeader?.name || id}`}
          snapshotFunc={() => snapshotCollectionOwners(id, backendClient)}
          style={{ marginBottom: 40 }}
        />
        <SnapshotEntry
          name={`Ids by owners ${collectionInfoHeader?.name || id}`}
          snapshotFunc={() =>
            snapshotCollectionOwnersWithIds(id, backendClient)
          }
          style={{ marginBottom: 40 }}
        />
        <SnapshotEntry
          name={`OGs ${collectionInfoHeader?.name || id}`}
          snapshotFunc={() => snapshotCollectionOGs(id, backendClient)}
        />
        <BrandText>"OGs" counts nfts minted and never listed</BrandText>
      </View>
    </ScreenContainer>
  );
};
