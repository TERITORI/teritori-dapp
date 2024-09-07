import { FC } from "react";
import { LeafletView } from "react-native-leaflet-view";

import { MapProps } from "@/components/socialFeed/Map/Map.types";
import { DEFAULT_MAP_POSITION } from "@/utils/feed/map";

export const Map: FC<MapProps> = ({
  locationSelected,
  locationToCenter = DEFAULT_MAP_POSITION,
}) => {
  return (
    <LeafletView
      renderLoading={() => <></>}
      zoom={12}
      mapCenterPosition={locationSelected || locationToCenter}
      mapLayers={[
        {
          url: `https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${process.env.EXPO_PUBLIC_LEAFLET_MAP_TOKEN}`,
        },
      ]}
      mapMarkers={[
        {
          position: locationSelected || locationToCenter,
          icon: "https://i.ibb.co/gSnJ70P/location.png", //load image from web; not work with local image
          size: [32, 32],
        },
      ]}
    />
  );
};
