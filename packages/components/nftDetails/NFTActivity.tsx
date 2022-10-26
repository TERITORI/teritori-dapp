import moment from "moment";
import React, { useState, useCallback, useEffect } from "react";
import { View } from "react-native";

import { Activity } from "../../api/marketplace/v1/marketplace";
import { backendClient } from "../../utils/backend";
import { prettyPrice } from "../../utils/coins";
import { BrandText } from "../BrandText";

export const NFTActivity: React.FC<{ id: string }> = ({ id }) => {
  const { activity } = useNFTActivity(id);
  return (
    <View>
      {activity.map((elem) => {
        return (
          <View style={{ flexDirection: "row" }}>
            <BrandText style={{ marginRight: 20 }}>
              {elem.transactionKind}
            </BrandText>
            <BrandText style={{ marginRight: 20 }}>
              {moment(elem.time).fromNow()}
            </BrandText>
            <BrandText>
              {prettyPrice(
                process.env.TERITORI_NETWORK_ID || "",
                elem.amount,
                elem.denom
              )}
            </BrandText>
          </View>
        );
      })}
    </View>
  );
};

const useNFTActivity = (nftId: string) => {
  const [activity, setActivity] = useState<Activity[]>([]);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const refresh = useCallback(() => {
    setRefreshIndex((i) => i + 1);
  }, []);
  useEffect(() => {
    const effect = async () => {
      try {
        const stream = backendClient.Activity({ nftId, limit: 20 });
        const act: Activity[] = [];
        await stream.forEach(({ activity: elem }) => {
          if (!elem) {
            return;
          }
          act.push(elem);
        });
        setActivity(act);
      } catch (err) {
        console.error(err);
      }
    };
    effect();
  }, [nftId, refreshIndex]);
  return { activity, refreshActivity: refresh };
};
