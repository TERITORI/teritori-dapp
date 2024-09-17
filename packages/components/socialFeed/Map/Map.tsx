import { FC } from "react";
import { LeafletView } from "react-native-leaflet-view";

import { MapProps } from "@/components/socialFeed/Map/Map.types";
import { DEFAULT_MAP_POSITION, MAP_LAYER_URL } from "@/utils/feed/map";

export const Map: FC<MapProps> = ({
  creatingPostLocation,
  locationToCenter = DEFAULT_MAP_POSITION,
}) => {
  return (
    <LeafletView
      renderLoading={() => <></>}
      zoom={12}
      mapCenterPosition={creatingPostLocation || locationToCenter}
      mapLayers={[
        {
          url: MAP_LAYER_URL,
        },
      ]}
      mapMarkers={[
        {
          position: creatingPostLocation || locationToCenter,
          icon: "https://i.ibb.co/gSnJ70P/location.png", //load image from web; not work with local image
          size: [32, 32],
        },
      ]}
    />
  );
};
