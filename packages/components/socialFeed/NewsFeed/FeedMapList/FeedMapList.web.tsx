import { DivIcon, PointExpression, point } from "leaflet";
import { FC, useMemo, useState } from "react";
import "../../modals/MapModal/styles.css";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3/lib";
import { View } from "react-native";

import { FeedMapListProps } from "@/components/socialFeed/NewsFeed/FeedMapList/FeedMapList.types";
import {
  combineFetchFeedAggregationsPages,
  combineFetchFeedPages,
  useFetchFeedLocation,
} from "@/hooks/feed/useFetchFeed";
import {
  getMapPostIconColorRgba,
  getMapPostIconSVGString,
} from "@/utils/feed/map";
import { zodTryParseJSON } from "@/utils/sanitize";
import {
  LatLngExpression,
  PostCategory,
  ZodSocialFeedPostMetadata,
} from "@/utils/types/feed";

interface MarkerPopup {
  position: LatLngExpression;
  popUp: string;
  postCategory: PostCategory;
  fileURL?: string;
}

// custom cluster icon
const createClusterCustomIcon = function (cluster: any): DivIcon {
  return new DivIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true) as PointExpression,
  });
};

const getIcon = (postCategory: PostCategory) => {
  const size = 32;
  const borderWidth = 1;
  const sizeWithBorders = 32 + borderWidth * 2;
  return new DivIcon({
    html: `<div style="border-radius: 99px;
    height: ${size}px; width: ${size}px; border: 1px solid #A3A3A3;
     background-color: rgba(${getMapPostIconColorRgba(postCategory)}); display: flex; align-items: center; justify-content: center;">${getMapPostIconSVGString(postCategory)}</div>`,
    className: "",
    iconSize: [sizeWithBorders, sizeWithBorders],
  });
};

const FeedMapList: FC<FeedMapListProps> = ({ style }) => {
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  //TODO: Handle loading, limit, etc
  const { data } = useFetchFeedLocation({
    north: bounds?.getNorth(),
    south: bounds?.getSouth(),
    west: bounds?.getWest(),
    east: bounds?.getEast(),
    limit: 100,
  });
  const posts = useMemo(
    () => (data ? combineFetchFeedPages(data.pages) : []),
    [data],
  );
  const aggregatedPosts = useMemo(
    () => (data ? combineFetchFeedAggregationsPages(data.pages) : []),
    [data],
  );

  const markers: MarkerPopup[] = useMemo(() => {
    if (!posts) return [];
    const results: MarkerPopup[] = [];
    posts.forEach((post) => {
      const metadata = zodTryParseJSON(
        ZodSocialFeedPostMetadata,
        post.metadata,
      );
      if (!metadata?.location) return;
      results.push({
        position: metadata.location,
        popUp: metadata.message,
        postCategory: post.category,
      });
    });
    return results;
  }, [posts]);

  const heatPoints = aggregatedPosts
    ? aggregatedPosts.map((aggregatedPost) => {
        return [
          aggregatedPost.lat,
          aggregatedPost.long,
          aggregatedPost.totalPoints,
        ];
      })
    : [];

  const FetchMarkersOnMove = () => {
    const map = useMapEvents({
      // Map events
      moveend: () => {
        setBounds(map.getBounds());
      },
      zoomend: () => {
        setBounds(map.getBounds());
      },
    });
    return null;
  };

  return (
    <View
      style={[
        {
          width: "100%",
        },
        style,
      ]}
    >
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={12}
        attributionControl={false}
      >
        <HeatmapLayer
          points={heatPoints}
          gradient={{
            0.1: "#89BDE0",
            0.2: "#96E3E6",
            0.4: "#82CEB6",
            0.6: "#FAF3A5",
            0.8: "#F5D98B",
            "1.0": "#DE9A96",
          }}
          intensityExtractor={(point) =>
            Array.isArray(point) && typeof point[2] === "string"
              ? parseFloat(point[2])
              : 0
          }
          longitudeExtractor={(point) =>
            Array.isArray(point) && typeof point[1] === "number" ? point[1] : 0
          }
          latitudeExtractor={(point) =>
            Array.isArray(point) && typeof point[0] === "number" ? point[0] : 0
          }
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
              icon={getIcon(PostCategory.Normal)}
              key={index}
            >
              <Popup closeButton={false} className="marker-popup">
                TODO
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        <FetchMarkersOnMove />
      </MapContainer>
    </View>
  );
};

export default FeedMapList;
