import { QueryClient } from "@tanstack/react-query";
import moment from "moment";
import React from "react";
import { FlatList, View } from "react-native";

import NotificationCard from "./NotificationCard";
import { notifications } from "./notificationData";

import {
  DismissNotificationRequest,
  Notification,
  NotificationsRequest,
} from "@/api/notification/v1/notification";
import { OmniLinkToType } from "@/components/OmniLink";
import { Separator } from "@/components/separators/Separator";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import {
  notificationsQueryKey,
  useNotifications,
} from "@/hooks/useNotifications";
import { parseUserId } from "@/networks";
import { mustGetNotificationClient } from "@/utils/backend";
import { prettyPrice } from "@/utils/coins";
import { layout } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";

export type NotificationType = {
  notificationId: string;
  img: { url: string };
  type: string;
  user?: { id: string; username: string; avatarUrl: string };
  price?: number;
  message?: string;
  postedAt: string;
  for?: string;
  from?: string;
  to?: string;
};

export const NotificationList = () => {
  useNotifications({ userId: "123" }); // wip
  return (
    <View
      style={{
        padding: layout.spacing_x2,
        position: "relative",
        zIndex: 0,
      }}
    >
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <React.Fragment key={item.notificationId}>
            <NotificationCard item={item} />
            <Separator style={{ marginVertical: layout.spacing_x1_5 }} />
          </React.Fragment>
        )}
      />
    </View>
  );
};

const useBuildBodyText = (item: Notification) => {
  const userInfo = useNSUserInfo(item.triggerBy);
  const name =
    userInfo?.metadata?.tokenId || tinyAddress(item.triggerBy, 30) || "";

  if (item.category === "reaction") {
    return `${name} ${item.body} your post.`;
  }
  if (item.category === "comment") {
    return `${name} commented your post.`;
  }
  if (item.category === "tip") {
    return `💸 ${name} TIP ${getPrettyPrice(item)} your post.`;
  }
  if (item.category === "nft-transfer") {
    return `${name} transfer an NFT.`;
  }
  if (item.category === "mint") {
    return `🤑 Your newly minted NFT is here.`;
  }
  if (item.category === "mint-tns") {
    const tnsTokenId = item.body.split(":");
    return `🎉 on minting ${tnsTokenId[0]}`;
  }
  if (item.category === "nft-trade-buyer") {
    return `Your NFT was sold for ${getPrettyPrice(item)}.`;
  }
  if (item.category === "nft-trade-seller") {
    return `${name} bought your nft for ${getPrettyPrice(item)}.`;
  }
  if (item.category === "dao-member-added") {
    return `${name} added to their organization`;
  }
  if (item.category === "dao-member-deleted") {
    return `${name} removed you from their organization`;
  }
  if (item.category === "dao-proposal-created") {
    return `${name} has new proposals to vote.`;
  }
  if (item.category === "p2e-riot-squad-staking") {
    return `Your R!OT fight ${
      moment.unix(item.createdAt).isBefore(moment.now())
        ? `has finished ${moment.unix(item.createdAt).fromNow()}`
        : `will finish in ${moment.unix(item.createdAt).fromNow()}`
    }`;
  }
};

const getOmniLink = (item: Notification): OmniLinkToType => {
  if (["reaction", "comment", "tip"].includes(item.category)) {
    return {
      screen: "FeedPostView",
      params: { id: item.action },
    };
  }
  if (
    [
      "nft-trade-seller",
      "nft-trade-buyer",
      "nft-transfer",
      "mint",
      "mint-tns",
    ].includes(item.category)
  ) {
    return {
      screen: "NFTDetail",
      params: { id: item.action },
    };
  }
  if (["p2e-riot-squad-staking"].includes(item.category)) {
    return {
      screen: "RiotGame",
    };
  }
  if (
    ["dao-member-removed", "dao-member-added", "dao-proposal-created"].includes(
      item.category,
    )
  ) {
    return {
      screen: "UserPublicProfile",
      params: { id: item.action },
    };
  }
  return {
    screen: "Home",
  };
};

const getPrettyPrice = (item: Notification): string => {
  const values = item.body.split(":");

  return prettyPrice(values[0], values[1], values[2]);
};

const clearAllNotifications = async (
  queryClient: QueryClient,
  req: Partial<NotificationsRequest>,
) => {
  const [network] = parseUserId(req?.userId);

  if (!network) {
    return false;
  }

  const notificationService = mustGetNotificationClient(network.id);
  await notificationService.DismissAllNotifications(req);
  await queryClient.invalidateQueries(notificationsQueryKey(req?.userId));
};

const clearNotification = async (
  queryClient: QueryClient,
  req: Partial<DismissNotificationRequest>,
) => {
  const [network] = parseUserId(req?.userId);

  if (!network) {
    return false;
  }

  const notificationService = mustGetNotificationClient(network.id);
  await notificationService.DismissNotification(req);
  await queryClient.invalidateQueries(notificationsQueryKey(req?.userId));
};
