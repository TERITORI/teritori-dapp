import "./styles.css";
import "leaflet/dist/leaflet.css";
import { DivIcon, LatLngBounds, point, PointExpression } from "leaflet";
import { FC, useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3/lib";
import { View } from "react-native";

import { Post } from "@/api/feed/v1/feed";
import { MapProps } from "@/components/socialFeed/Map/Map.types";
import { ArticleMapPost } from "@/components/socialFeed/Map/MapPosts/ArticleMapPost";
import { MusicMapPost } from "@/components/socialFeed/Map/MapPosts/MusicMapPost";
import { NormalMapPost } from "@/components/socialFeed/Map/MapPosts/NormalMapPost";
import { PictureMapPost } from "@/components/socialFeed/Map/MapPosts/PictureMapPost";
import { VideoMapPost } from "@/components/socialFeed/Map/MapPosts/VideoMapPost";
import { useFetchFeedLocation } from "@/hooks/feed/useFetchFeed";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import {
  DEFAULT_MAP_POSITION,
  getMapPostIconColorRgba,
  getMapPostIconSVGString,
  MAP_LAYER_URL,
} from "@/utils/feed/map";
import { zodTryParseJSON } from "@/utils/sanitize";
import {
  CustomLatLngExpression,
  PostCategory,
  ZodSocialFeedPostMetadata,
} from "@/utils/types/feed";

interface MarkerPopup {
  position: CustomLatLngExpression;
  post: Post;
  fileURL?: string;
}

// Custom map post icon
const postIcon = (postCategory: PostCategory) => {
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

// Custom cluster icon
const clusterIcon = function (cluster: any) {
  return new DivIcon({
    html: `<div class="cluster-icon-wrapper"><span class="cluster-icon">${cluster.getChildCount()}</span></div>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true) as PointExpression,
  });
};

export const Map: FC<MapProps> = ({
  locationToCenter = DEFAULT_MAP_POSITION,
  style,
  creatingPostLocation,
  creatingPostCategory = -1,
}) => {
  const selectedNetworkId = useSelectedNetworkId();
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

  // Prevent infinite rendering after locationSelected update
  const [localLocationSelected, setLocalLocationSelected] = useState<
    CustomLatLngExpression | undefined
  >(creatingPostLocation);
  useEffect(() => {
    setLocalLocationSelected(creatingPostLocation);
  }, [creatingPostLocation]);

  // ---- Fetch existing posts that have a location and display them as markers
  const { data } = useFetchFeedLocation({
    // Ensure proper hook call
    north: bounds?.getNorth(),
    south: bounds?.getSouth(),
    west: bounds?.getWest(),
    east: bounds?.getEast(),
    networkId: selectedNetworkId,
  });
  const posts = data?.list;
  const aggregatedPosts = data?.aggregations;

  const markers: MarkerPopup[] = useMemo(() => {
    if (!posts) return [];
    const results: MarkerPopup[] = [];
    posts.forEach((post, index) => {
      const metadata = zodTryParseJSON(
        ZodSocialFeedPostMetadata,
        post.metadata,
      );
      if (!metadata?.location) return;
      results.push({
        position: metadata.location,
        post,
      });
    });
    return results;
  }, [posts]);

  // ---- Heatmap
  const heatPoints = aggregatedPosts
    ? aggregatedPosts.map((aggregatedPost) => {
        return [
          aggregatedPost.lat,
          aggregatedPost.long,
          aggregatedPost.totalPoints,
        ];
      })
    : [];

  // ---- Updates map bounds on map manipulation
  const UpdateBoundsOnMapEvents = () => {
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

  // ---- Center to locationSelected when it's updated (Once)
  const UpdateToLocationSelected = () => {
    const map = useMap();
    useEffect(() => {
      if (localLocationSelected) {
        map.setView(localLocationSelected);
        setLocalLocationSelected(undefined);
      }
    }, [map]);
    return null;
  };

  return (
    <View
      style={[
        {
          width: "100%",
          height: "100%",
          alignSelf: "center",
        },
        style,
      ]}
    >
      <MapContainer
        center={creatingPostLocation || locationToCenter}
        zoom={12}
        attributionControl={false}
      >
        {/*----Loads and displays tiles on the map*/}
        <TileLayer noWrap attribution="" url={MAP_LAYER_URL} />

        {/*---- Heatmap displayed when dezoom*/}
        <HeatmapLayer
          points={heatPoints}
          gradient={{
            0.1: "#89BDE0",
            0.2: "#96E3E6",
            0.4: "#82CEB6",
            0.6: "#FAF3A5",
            0.8: "#F5D98B",
            1.0: "#DE9A96",
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

        {/*---- Existing posts that have a location*/}
        <MarkerClusterGroup chunkedLoading iconCreateFunction={clusterIcon}>
          {/*  When the user is creating a post*/}
          {creatingPostLocation && (
            <Marker
              position={creatingPostLocation}
              icon={postIcon(creatingPostCategory)}
            />
          )}
          {/* Mapping through the markers (Fetched posts) */}
          {markers?.map((marker, index) => (
            <Marker
              position={marker.position}
              icon={postIcon(marker.post.category)}
              key={index}
            >
              {marker.post.category === PostCategory.Normal ? (
                <Popup closeButton={false} className="marker-popup">
                  <NormalMapPost post={marker.post} />
                </Popup>
              ) : marker.post.category === PostCategory.MusicAudio ||
                marker.post.category === PostCategory.Audio ? (
                <Popup closeButton={false} className="marker-popup">
                  <MusicMapPost post={marker.post} />
                </Popup>
              ) : marker.post.category === PostCategory.VideoNote ||
                marker.post.category === PostCategory.Video ? (
                <Popup closeButton={false} className="marker-popup">
                  <VideoMapPost post={marker.post} />
                </Popup>
              ) : marker.post.category === PostCategory.Picture ? (
                <Popup closeButton={false} className="marker-popup">
                  <PictureMapPost post={marker.post} />
                </Popup>
              ) : marker.post.category === PostCategory.Article ? (
                <Popup closeButton={false} className="marker-popup">
                  <ArticleMapPost post={marker.post} />
                </Popup>
              ) : null}
            </Marker>
          ))}
        </MarkerClusterGroup>

        {/*---- Map state updates*/}
        <UpdateBoundsOnMapEvents />
        <UpdateToLocationSelected />
      </MapContainer>
    </View>
  );
};
