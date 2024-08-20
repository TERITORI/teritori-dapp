import React, { FC, useState } from "react";
import { useWindowDimensions, View } from "react-native";

import { HubBanner } from "@/components/hub/HubBanner";
import { useBanners } from "@/hooks/marketing/useBanners";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { EditButton } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadAdministrationOverview/component/MarketingEdition/EditButton";

// Multiple Banners ?
export const BannersEdition: FC = () => {
  const networkId = useSelectedNetworkId();
  const banners = useBanners(networkId);
  const banner = banners?.length ? banners[0] : undefined;
  const { width } = useWindowDimensions();

  const [isEditing, setIsEditing] = useState(false);

  return (
    <View>
      <EditButton
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        saveChanges={() => {
          // TODO
        }}
      />

      {/*TODO: Edition*/}
      {banner && <HubBanner width={width} banner={banner} />}
    </View>
  );
};
