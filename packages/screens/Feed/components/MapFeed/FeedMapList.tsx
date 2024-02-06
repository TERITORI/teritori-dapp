import L, { Icon, DivIcon, Point } from "leaflet";
import React from "react";
import "./styles.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { StyleProp, View, ViewStyle } from "react-native";

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
  const icon_ = new Icon({ iconUrl: iconList[`${type}`], iconSize: [38, 38] });
  return icon_;
};

const markers = [
  {
    geocode: [48.86, 2.3522],
    popUp: "Hello, I am pop up 1",
    type: "picture",
  },
  {
    geocode: [48.85, 2.3522],
    popUp: "Hello, I am pop up 2",
    type: "text",
  },
  {
    geocode: [48.855, 2.34],
    popUp: "Hello, I am pop up 3",
    type: "video",
  },
  {
    geocode: [48.85, 2.31],
    popUp: "Hello, I am pop up 3",
    type: "audio",
  },
];

export const FeedMapList: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  return (
    <View style={[containerCStyle, style]}>
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={12}
        attributionControl={false}
      >
        <TileLayer
          attribution=""
          url="https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=QkwJFLzzxPan25YCgnDExGpMFPxA3x4lnyKiUf8zmaqXLP5XyOR8n3yEM8jlKV3W"
        />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {/* Mapping through the markers */}
          {markers.map((marker: any) => (
            <Marker position={marker.geocode} icon={getIcon(marker.type)}>
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </View>
  );
};

const containerCStyle: ViewStyle = {
  width: "100%",
};
