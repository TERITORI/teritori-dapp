import "./styles.css";
import "leaflet/dist/leaflet.css";
import {
  DivIcon,
  LatLngBounds,
  LatLngExpression,
  point,
  PointExpression,
} from "leaflet";
import { FC, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3/lib";
import { View } from "react-native";

import { Post } from "@/api/feed/v1/feed";
import { BrandText } from "@/components/BrandText";
import { MapProps } from "@/components/socialFeed/Map/Map.types";
import { ArticleMapPost } from "@/components/socialFeed/Map/MapPosts/ArticleMapPost";
import { MusicMapPost } from "@/components/socialFeed/Map/MapPosts/MusicMapPost";
import { NormalMapPost } from "@/components/socialFeed/Map/MapPosts/NormalMapPost";
import { PictureMapPost } from "@/components/socialFeed/Map/MapPosts/PictureMapPost";
import { VideoMapPost } from "@/components/socialFeed/Map/MapPosts/VideoMapPost";
import {
  combineFetchFeedAggregationsPages,
  combineFetchFeedPages,
  useFetchFeedLocation,
} from "@/hooks/feed/useFetchFeed";
import {
  DEFAULT_MAP_POSITION,
  getMapPostIconColorRgba,
  getMapPostIconSVGString,
} from "@/utils/feed/map";
import { zodTryParseJSON } from "@/utils/sanitize";
import { errorColor } from "@/utils/style/colors";
import { fontSemibold10 } from "@/utils/style/fonts";
import { PostCategory, ZodSocialFeedPostMetadata } from "@/utils/types/feed";

interface MarkerPopup {
  position: LatLngExpression;
  post: Post;
  fileURL?: string;
}

// Custom map post icon
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

// Custom cluster icon TODO: Make better style respecting the Figma
const createClusterCustomIcon = function (cluster: any): DivIcon {
  return new DivIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true) as PointExpression,
  });
};

export const Map: FC<MapProps> = ({
  // FIXME: locationSelected not updated when selecting an address from AddressSearch
  locationSelected,
  locationToCenter = DEFAULT_MAP_POSITION,
  style,
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
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

  // ---- Existing posts that have a location
  const { data } = useFetchFeedLocation({
    // Ensure proper hook call
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
    posts
      .map((post, index) => {
        return {
          ...post,
          category:
            index % 5 === 0
              ? PostCategory.Normal
              : index + (1 % 5) === 0
                ? PostCategory.Article
                : index + (2 % 5) === 0
                  ? PostCategory.MusicAudio
                  : index + (3 % 5) === 0
                    ? PostCategory.Video
                    : PostCategory.Picture,
        };
      })
      .forEach((post) => {
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

  // ---- Updates existing posts on map manipulation
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
          height: "100%",
          alignSelf: "center",
        },
        style,
      ]}
    >
      <MapContainer
        center={locationToCenter || locationSelected}
        zoom={12}
        attributionControl={false}
      >
        {/*----Loads and displays tiles on the map*/}
        <TileLayer
          noWrap
          attribution=""
          url="https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=QkwJFLzzxPan25YCgnDExGpMFPxA3x4lnyKiUf8zmaqXLP5XyOR8n3yEM8jlKV3W"
        />

        {/*---- When the user creates a post and want to add a location to it*/}
        {locationSelected && (
          <Marker position={locationSelected} icon={customIcon} />
        )}

        {/*---- Heatmap displayed when dezoom*/}
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

        {/*---- Existing posts that have a location*/}
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {/* Mapping through the markers */}
          {markers?.map((marker, index) => (
            <Marker
              position={marker.position}
              icon={getIcon(marker.post.category)}
              key={index}
            >
              <Popup closeButton={false} className="marker-popup">
                {marker.post.category === PostCategory.Normal ? (
                  <NormalMapPost post={marker.post} />
                ) : marker.post.category === PostCategory.MusicAudio ? (
                  <MusicMapPost post={marker.post} />
                ) : marker.post.category === PostCategory.Video ? (
                  <VideoMapPost post={marker.post} />
                ) : marker.post.category === PostCategory.Picture ? (
                  <PictureMapPost post={marker.post} />
                ) : marker.post.category === PostCategory.Article ? (
                  <ArticleMapPost post={marker.post} />
                ) : (
                  <BrandText style={[fontSemibold10, { color: errorColor }]}>
                    No render for this post category
                  </BrandText>
                )}
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        {/*---- Updates existing posts on map manipulation*/}
        <FetchMarkersOnMove />
      </MapContainer>
    </View>
  );
};
