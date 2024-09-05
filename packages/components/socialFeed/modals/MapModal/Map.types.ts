import { LatLng } from "react-native-leaflet-view";

import { PostCategory } from "@/utils/types/feed";

export interface MapProps {
  locationSelected: LatLng;
  postCategory?: PostCategory;
}
