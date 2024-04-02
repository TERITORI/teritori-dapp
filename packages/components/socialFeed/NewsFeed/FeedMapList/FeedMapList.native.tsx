import React from "react";
import { LatLng, LeafletView, MapMarker } from "react-native-leaflet-view";

import { FeedMapListProps } from "@/components/socialFeed/NewsFeed/FeedMapList/FeedMapList.types";

const FeedMapList: React.FC<FeedMapListProps> = () => {
  const getIcon = (type: string) => {
    const iconList: { [key: string]: string } = {
      picture: "https://i.ibb.co/WkQxJQP/picture.png",
      text: "https://i.ibb.co/VLBQ0Bt/text.png",
      video: "https://i.ibb.co/pxrhKLC/video.png",
      audio: "https://i.ibb.co/ZJkg6RD/music.png",
    };
    return iconList[`${type}`];
  };

  const getPosition = (location: [number, number]) => {
    const DEFAULT_COORDINATE: LatLng = {
      lat: location[0],
      lng: location[1],
    };
    return DEFAULT_COORDINATE;
  };

  const markers: MapMarker[] = [
    {
      position: getPosition([48.86, 2.3522]),
      icon: getIcon("picture"), //load image from web; not work with local image
      size: [32, 32],
    },
    {
      position: getPosition([48.85, 2.3522]),
      icon: getIcon("text"), //load image from web; not work with local image
      size: [32, 32],
    },
    {
      position: getPosition([48.855, 2.34]),
      icon: getIcon("video"), //load image from web; not work with local image
      size: [32, 32],
    },
    {
      position: getPosition([48.85, 2.31]),
      icon: getIcon("audio"), //load image from web; not work with local image
      size: [32, 32],
    },
  ];

  return (
    <LeafletView
      renderLoading={() => <></>}
      zoom={12}
      mapCenterPosition={[48.8566, 2.3522]}
      mapLayers={[
        {
          url: "https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=QkwJFLzzxPan25YCgnDExGpMFPxA3x4lnyKiUf8zmaqXLP5XyOR8n3yEM8jlKV3W",
        },
      ]}
      mapMarkers={markers}
    />
  );
};

export default FeedMapList;
