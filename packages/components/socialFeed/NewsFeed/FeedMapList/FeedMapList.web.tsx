import L, { DivIcon, Icon, LatLngExpression, Point } from "leaflet";
import React from "react";
import "../../modals/MapModal/styles.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer,useMap } from "react-leaflet";
import { useEventHandlers } from '@react-leaflet/core'
import MarkerClusterGroup from "react-leaflet-cluster";
import { View, ViewStyle, } from "react-native";

import { FeedMapListProps } from "@/components/socialFeed/NewsFeed/FeedMapList/FeedMapList.types";

interface MarkerPopup {
  position: LatLngExpression;
  popUp: string;
  type: "picture" | "text" | "video" | "audio";
  fileURL?: string;
}

// custom cluster icon
const createClusterCustomIcon = function (cluster: any): DivIcon {
  return new L.DivIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: L.point(33, 33, true) as Point,
  });
};

const getIcon = (type: string) => {
  const iconList: { [key: string]: string } = {
    picture: "https://i.ibb.co/WkQxJQP/picture.png",
    text: "https://i.ibb.co/VLBQ0Bt/text.png",
    video: "https://i.ibb.co/pxrhKLC/video.png",
    audio: "https://i.ibb.co/ZJkg6RD/music.png",
  };
  return new Icon({ iconUrl: iconList[`${type}`], iconSize: [38, 38] });
};

const getPostType = (metadata: JSON) => {
  if (metadata.files?.length < 1) {
    return "text";
  }
  if (metadata.files?.[0].fileType.includes("video")) {
    return "video";
  }
  if (metadata.files?.[0].fileType.includes("audio")) {
    return "audio";
  }
  return "picture";
};


const FeedMapList: React.FC<FeedMapListProps> = ({ style, data }) => {
  console.log("FeedMapList DATA", data);
  if (!data.pages?.length) {
    return null;
  }

  let markers: MarkerPopup[] = [
    {
      position: [48.86, 2.3522],
      popUp: "Hello, I am pop up 1",
      type: "picture",
    },
    {
      position: [48.85, 2.3522],
      popUp: "Hello, I am pop up 2",
      type: "text",
    },
    {
      position: [48.855, 2.34],
      popUp: "Hello, I am pop up 3",
      type: "video",
    },
    {
      position: [48.85, 2.31],
      popUp: "Hello, I am pop up 3",
      type: "audio",
    },
  ];

  const FetchMarkersOnMove = () => {
    const map = useMap()

    // Listen to events when moving map
    const onChange = React.useCallback(() => {
      console.log(map.getBounds())
    }, [map])

    const handlers = React.useMemo(() => ({ zoomend: onChange, moveend: onChange }), [map])
    useEventHandlers({ instance: map }, handlers)

  return null
}

  for (let item of data.pages[0].list) {
    let metadata =JSON.parse(item.metadata);
    if (metadata.location) {
      markers.push({
        position: metadata.location,
        popUp: metadata.message,
        type: getPostType(metadata),
      });
    }
  }
  return (
    <View style={[containerCStyle, style]}>
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={12}
        attributionControl={false}  
      >
        <TileLayer
          noWrap
          attribution=""
          url="https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=QkwJFLzzxPan25YCgnDExGpMFPxA3x4lnyKiUf8zmaqXLP5XyOR8n3yEM8jlKV3W"
        />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {/* Mapping through the markers */}
          {markers.map((marker, index) => (
            <Marker
              position={marker.position}
              icon={getIcon(marker.type)}
              key={index}
            >
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        <FetchMarkersOnMove/>
      </MapContainer>
    </View>
  );
};

const containerCStyle: ViewStyle = {
  width: "100%",
};

export default FeedMapList;
