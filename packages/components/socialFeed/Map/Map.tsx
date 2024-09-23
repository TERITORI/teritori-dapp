import { FC } from "react";
import { LeafletView } from "react-native-leaflet-view";

import { MapProps } from "@/components/socialFeed/Map/Map.types";
import { DEFAULT_MAP_POSITION, MAP_LAYER_URL } from "@/utils/feed/map";

// TODO: Map mobile

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
          icon: "",
          size: [32, 32],
        },
      ]}
    />
  );
};
