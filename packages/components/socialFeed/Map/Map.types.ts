import { StyleProp, ViewStyle } from "react-native";
import { LatLng } from "react-native-leaflet-view";

import { PostCategory } from "@/utils/types/feed";

export interface MapProps {
  locationSelected?: LatLng;
  postCategory?: PostCategory;
  style?: StyleProp<ViewStyle>;
}
