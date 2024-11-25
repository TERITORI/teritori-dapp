import { FC } from "react";
import { LeafletView } from "react-native-leaflet-view";

import { MapProps } from "@/components/socialFeed/Map/Map.types";
import { DEFAULT_MAP_POSITION, MAP_LAYER_URL } from "@/utils/feed/map";

// TODO: Map mobile

export const Map: FC<MapProps> = ({
  creatingPostLocation,
  // consultedPostId, TODO:
}) => {
  return (
    <LeafletView
      renderLoading={() => <></>}
      zoom={12}
      mapCenterPosition={DEFAULT_MAP_POSITION}
      mapLayers={[
        {
          url: MAP_LAYER_URL,
        },
      ]}
      mapMarkers={[
        {
          position: DEFAULT_MAP_POSITION,
          icon: "",
          size: [32, 32],
        },
      ]}
    />
  );
};
