import L, { DivIcon, Icon, LatLngExpression, Point } from "leaflet";
import React, { useEffect } from "react";
import "../../modals/MapModal/styles.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEventHandlers } from "@react-leaflet/core";
import MarkerClusterGroup from "react-leaflet-cluster";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import { View, ViewStyle } from "react-native";

import { Post } from "@/api/feed/v1/feed";
import { useFetchFeedLocation } from "@/hooks/feed/useFetchFeed";

interface MarkerPopup {
  position: LatLngExpression;
  popUp: string;
  type: "picture" | "text" | "video" | "audio";
  fileURL?: string;
}

type AggregatedPost = {
  lat: number;
  long: number;
  totalPoints: number;
};
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

const FeedMapList = ({ style }) => {
  const [bounds, setBounds] = React.useState<L.LatLngBounds | null>(null);
  const [posts, setPosts] = React.useState<Post[] | null>(null);
  const [aggregatedPosts, setAggregatedPosts] = React.useState<
    AggregatedPost[] | null
  >(null);

  const getFeedLocation = useFetchFeedLocation();

  const markers: MarkerPopup[] = posts
    ? posts?.map((post) => {
        const metadata = JSON.parse(post.metadata);
        return {
          position: metadata.location,
          popUp: metadata.message,
          type: getPostType(metadata),
        };
      })
    : [];
  const heat = aggregatedPosts
    ? aggregatedPosts.map((aggregatedPost) => {
        return [
          aggregatedPost.lat,
          aggregatedPost.long,
          aggregatedPost.totalPoints,
        ];
      })
    : [];
  useEffect(() => {
    getFeedLocation({
      // Ensure proper hook call
      north: bounds?.getNorth(),
      south: bounds?.getSouth(),
      west: bounds?.getWest(),
      east: bounds?.getEast(),
      limit: 100,
    }).then((res) => {
      console.log("res", res);
      setPosts(res.list);
      setAggregatedPosts(res.aggreations);
    });
  }, [bounds]);
  const FetchMarkersOnMove = () => {
    const map = useMap();

    // Listen to events when moving map
    const onChange = React.useCallback(() => {
      setBounds(map.getBounds());
    }, [map]);

    const handlers = React.useMemo(
      () => ({ zoomend: onChange, moveend: onChange }),
      [map],
    );
    useEventHandlers({ instance: map }, handlers);

    return null;
  };

  return (
    <View style={[containerCStyle, style]}>
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={12}
        attributionControl={false}
      >
        <HeatmapLayer
          points={heat}
          gardients={{
            0.1: "#89BDE0",
            0.2: "#96E3E6",
            0.4: "#82CEB6",
            0.6: "#FAF3A5",
            0.8: "#F5D98B",
            "1.0": "#DE9A96",
          }}
          intensityExtractor={(m) => parseFloat(m[2])}
          longitudeExtractor={(m) => m[1]}
          latitudeExtractor={(m) => m[0]}
        />
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
          {markers?.map((marker, index) => (
            <Marker
              position={marker.position}
              icon={getIcon(marker.type)}
              key={index}
            >
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        <FetchMarkersOnMove />
      </MapContainer>
    </View>
  );
};

const containerCStyle: ViewStyle = {
  width: "100%",
};

export default FeedMapList;
