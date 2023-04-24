import * as Clipboard from "expo-clipboard";
import React from "react";
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  Linking,
} from "react-native";

import copySVG from "../../../assets/icons/copy.svg";
import dotsCircleSVG from "../../../assets/icons/dots-circle.svg";
import { BrandText } from "../../components/BrandText";
import { Menu } from "../../components/Menu";
import { NetworkIcon } from "../../components/NetworkIcon";
import { SVG } from "../../components/SVG";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { rewardsPrice, TotalRewards, useRewards } from "../../hooks/useRewards";
import { accountExplorerLink, getUserId } from "../../networks";
import { neutral33, neutral77 } from "../../utils/style/colors";

export interface WalletItemProps {
  index: number;
  itemsCount: number;
  item: {
    id: number;
    title: string;
    address: string;
    pendingRewards: TotalRewards[];
    staked: number;
    networkId: string;
  };
}

export const WalletItem: React.FC<WalletItemProps> = ({
  index,
  item,
  itemsCount,
}) => {
  const { width } = useWindowDimensions();
  const { setToastSuccess } = useFeedbacks();
  const { claimAllRewards } = useRewards(
    getUserId(item.networkId, item.address)
  );

  // Total rewards price with all denoms
  const claimablePrice = rewardsPrice(item.pendingRewards);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: index !== itemsCount - 1 ? 1 : 0,
        borderColor: neutral33,
        paddingVertical: 16,
        zIndex: 10 + itemsCount - index,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <NetworkIcon networkId={item.networkId} size={64} />
        <View style={{ marginLeft: 16 }}>
          <View>
            <BrandText>{item.title}</BrandText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <BrandText
                style={{
                  fontSize: 12,
                }}
              >
                {item.address}
              </BrandText>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(item.address);
                  setToastSuccess({
                    title: "Copied",
                    message: "",
                  });
                }}
                style={{
                  height: 24,
                  width: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 4,
                }}
              >
                <SVG width={24} height={24} source={copySVG} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            paddingRight: 32,
            borderRightWidth: 1,
            borderColor: neutral33,
          }}
        >
          <BrandText
            style={{
              fontSize: 12,
              color: neutral77,
              marginBottom: 2,
            }}
          >
            Staked
          </BrandText>
          <BrandText
            style={{
              fontSize: 14,
            }}
          >
            {/*String(item.staked).split(".")[0]*/}
            Coming Soon
            {/*<BrandText
              style={{
                color: neutralA3,
                fontSize: 14,
              }}
            >
              .{String(item.staked).split(".")[1]}
            </BrandText>*/}
          </BrandText>
        </View>
        <View
          style={{
            paddingHorizontal: 32,
          }}
        >
          <BrandText
            style={{
              fontSize: 12,
              color: neutral77,
              marginBottom: 2,
            }}
          >
            Pending rewards
          </BrandText>
          <BrandText
            style={{
              fontSize: 14,
            }}
          >
            {`$${claimablePrice.toFixed(2)}`}
          </BrandText>
        </View>

        {width > 1150 && (
          <SecondaryButton
            size="XS"
            text="Claim rewards"
            disabled={!claimablePrice}
            onPress={claimAllRewards}
            loader
            style={{ marginRight: 16 }}
          />
        )}

        <Menu
          component={<SVG height={32} width={32} source={dotsCircleSVG} />}
          items={[
            ...(width <= 1150
              ? [
                  {
                    label: "Claim rewards",
                    onPress: claimAllRewards,
                    disabled: !claimablePrice,
                  },
                  {
                    label: "Stake",
                    onPress: () => {},
                  },
                ]
              : []),
            {
              label: "View on Explorer",
              onPress: () => {
                console.log("item", item);
                Linking.openURL(
                  accountExplorerLink(item.networkId, item.address)
                );
              },
            },
            {
              label: "Rename address",
              onPress: () => {},
            },
            {
              label: "Delete wallet",
              onPress: () => {},
            },
          ]}
        />
      </View>
    </View>
  );
};
