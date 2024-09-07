import { FC } from "react";
import { LatLng, LeafletView } from "react-native-leaflet-view";

import { MapProps } from "@/components/socialFeed/Map/Map.types";

export const Map: FC<MapProps> = ({ locationSelected }) => {
  const DEFAULT_COORDINATE: LatLng = locationSelected
    ? {
        lat: locationSelected[0],
        lng: locationSelected[1],
      }
    : [48.8566, 2.3522];

  return (
    <LeafletView
      renderLoading={() => <></>}
      zoom={12}
      mapCenterPosition={DEFAULT_COORDINATE}
      mapLayers={[
        {
          url: `https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${process.env.EXPO_PUBLIC_LEAFLET_MAP_TOKEN}`,
        },
      ]}
      mapMarkers={[
        {
          position: DEFAULT_COORDINATE,
          icon: "https://i.ibb.co/gSnJ70P/location.png", //load image from web; not work with local image
          size: [32, 32],
        },
      ]}
    />
  );
};
