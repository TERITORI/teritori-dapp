import { useMemo } from "react";
import { StyleProp, ViewStyle, View, TouchableOpacity } from "react-native";

import { useIsDAO } from "../../hooks/dao/useIsDAO";
import { useNSNameOwner } from "../../hooks/useNSNameOwner";
import { useNSPrimaryAlias } from "../../hooks/useNSPrimaryAlias";
import { getUserId, parseUserId } from "../../networks";
import { fontSemibold12 } from "../../utils/style/fonts";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import { UserAvatarWithFrame } from "../images/AvatarWithFrame";

export const AvatarWithName: React.FC<
  (
    | {
        networkId: string | undefined;
        name: string | undefined;
      }
    | {
        userId: string | undefined;
      }
  ) & {
    style?: StyleProp<ViewStyle>;
    onPress: (userId: string, name?: string) => void;
    hideDAOs?: boolean;
  }
> = (props) => {
  const { nameOwner } = useNSNameOwner(
    "networkId" in props ? props.networkId : undefined,
    "name" in props ? props.name : undefined
  );

  const userId = useMemo(() => {
    if ("name" in props && "networkId" in props) {
      return getUserId(props.networkId, nameOwner);
    }
    if ("userId" in props) {
      return props.userId;
    }
  }, [props, nameOwner]);

  const { isDAO } = useIsDAO(userId);
  if (isDAO && props.hideDAOs) return <></>;
  if ("name" in props) {
    return <AvatarWithNameFromName {...props} />;
  }
  return <AvatarWithNameFromUserId {...props} />;
};

const AvatarWithNameFromName: React.FC<{
  networkId: string | undefined;
  name: string | undefined;
  style?: StyleProp<ViewStyle>;
  onPress: (userId: string, name?: string) => void;
}> = ({ networkId, name, style, onPress }) => {
  const { nameOwner } = useNSNameOwner(networkId, name);
  return (
    <AvatarWithNameView
      name={name}
      userId={getUserId(networkId, nameOwner)}
      style={style}
      onPress={onPress}
    />
  );
};

const AvatarWithNameFromUserId: React.FC<{
  userId: string | undefined;
  style?: StyleProp<ViewStyle>;
  onPress: (userId: string, name?: string) => void;
}> = ({ userId, style, onPress }) => {
  const { primaryAlias } = useNSPrimaryAlias(userId);
  return (
    <AvatarWithNameView
      name={primaryAlias || undefined}
      userId={userId}
      style={style}
      onPress={onPress}
    />
  );
};

const AvatarWithNameView: React.FC<{
  name: string | undefined;
  userId: string | undefined;
  style?: StyleProp<ViewStyle>;
  onPress: (userId: string, name?: string) => void;
}> = ({ name, userId, style, onPress }) => {
  const [, userAddress] = parseUserId(userId);
  const content = (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <UserAvatarWithFrame
        userId={userId}
        size="XS"
        style={{
          marginRight: 4,
        }}
      />
      <BrandText style={[fontSemibold12]}>
        @{name || tinyAddress(userAddress, 15)}
      </BrandText>
    </View>
  );
  return (
    <View style={style}>
      {userId ? (
        <TouchableOpacity
          onPress={() => {
            onPress(userId, name);
          }}
        >
          {content}
        </TouchableOpacity>
      ) : (
        content
      )}
    </View>
  );
};
