import "./styles.css";
import "leaflet/dist/leaflet.css";
import { DivIcon } from "leaflet";
import { FC, useMemo } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

import { MapProps } from "@/components/socialFeed/modals/MapModal/Map.types";
import {
  getMapPostIconColorRgba,
  getMapPostIconSVGString,
} from "@/utils/feed/map";

// TODO: Factorize stuff from here with FeedMapList.web.tsx

const Map: FC<MapProps> = ({
  // FIXME: locationSelected not updated
  locationSelected,
  postCategory = -1,
}) => {
  const customIcon = useMemo(
    () =>
      new DivIcon({
        html: `<div style="border-radius: 99px;
    height: 32px; width: 32px; border: 1px solid #A3A3A3;
     background-color: rgba(${getMapPostIconColorRgba(postCategory)}); display: flex; align-items: center; justify-content: center;">${getMapPostIconSVGString(postCategory)}</div>`,
        className: "",
        iconSize: [34, 34],
      }),
    [postCategory],
  );

  return (
    <MapContainer
      center={locationSelected || [48.8566, 2.3522]}
      zoom={12}
      attributionControl={false}
    >
      <TileLayer
        noWrap
        attribution=""
        url="https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=QkwJFLzzxPan25YCgnDExGpMFPxA3x4lnyKiUf8zmaqXLP5XyOR8n3yEM8jlKV3W"
      />
      {locationSelected && (
        <Marker position={locationSelected} icon={customIcon} />
      )}
    </MapContainer>
  );
};

export default Map;
