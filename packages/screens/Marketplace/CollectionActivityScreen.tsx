import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, ListRenderItem, View, Image } from "react-native";
import { useSelector } from "react-redux";

import {
  Activity,
  ActivityRequest,
} from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { selectSelectedNetworkId } from "../../store/slices/settings";
import { backendClient } from "../../utils/backend";
import { prettyPrice } from "../../utils/coins";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { ScreenFC } from "../../utils/navigation";

const useCollectionActivity = (
  req: ActivityRequest
): [Activity[], () => Promise<void>] => {
  const [activity, setActivity] = useState<Activity[]>([]);

  const fetchMore = useCallback(async () => {
    try {
      const offsetReq = {
        ...req,
        offset: req.offset + activity.length,
      };
      const stream = backendClient.Activity(offsetReq);
      let newActivity: Activity[] = [];
      await stream.forEach((response) => {
        if (!response.activity) {
          return;
        }
        newActivity = [...newActivity, response.activity];
      });
      setActivity((activity) => [...activity, ...newActivity]);
    } catch (err) {
      console.warn("failed to fetch collection activity:", err);
    }
  }, [req, activity]);

  useEffect(() => {
    setActivity([]);
    fetchMore();
  }, [req.collectionId]);

  return [activity, fetchMore];
};

const keyExtractor = (item: Activity, index: number) => `${index}`;

const RenderItem: ListRenderItem<Activity> = (info) => {
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const gap = 20;
  const activity = info.item;
  return (
    <View
      style={{ flexDirection: "row", marginBottom: gap, alignItems: "center" }}
    >
      <Image
        source={{
          uri: activity.targetImageUri.startsWith("ipfs://")
            ? ipfsURLToHTTPURL(activity.targetImageUri)
            : activity.targetImageUri,
        }}
        style={{ width: 40, height: 40 }}
      />
      <BrandText style={{ marginLeft: gap }}>{activity.targetName}</BrandText>
      <BrandText style={{ marginLeft: gap }}>
        {activity.transactionKind}
      </BrandText>
      <BrandText style={{ marginLeft: gap }}>
        {moment(activity.time).fromNow()}
      </BrandText>
      <BrandText style={{ marginLeft: gap }}>
        {prettyPrice(selectedNetworkId, activity.amount, activity.denom)}
      </BrandText>
    </View>
  );
};

const BoundariesSpacer: React.FC = () => <View style={{ height: 100 }} />;

export const CollectionActivityScreen: ScreenFC<"CollectionActivity"> = ({
  route: {
    params: { id },
  },
}) => {
  const [activity, fetchMore] = useCollectionActivity({
    nftId: "",
    collectionId: id,
    limit: 20,
    offset: 0,
  });
  return (
    <ScreenContainer>
      <FlatList
        data={activity}
        onEndReached={fetchMore}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={4}
        renderItem={RenderItem}
        ListHeaderComponent={BoundariesSpacer}
        ListFooterComponent={BoundariesSpacer}
      />
    </ScreenContainer>
  );
};
