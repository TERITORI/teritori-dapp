import { StyleProp, ViewStyle } from "react-native";
import { LatLng } from "react-native-leaflet-view";

import { PostCategory } from "@/utils/types/feed";

export interface MapProps {
  locationSelected?: LatLng; // When the user is adding a location to a post he's creating
  locationToCenter?: LatLng; // When the user want to see a post's position on the Map (From Jungle Feed for example)
  postCategory?: PostCategory;
  style?: StyleProp<ViewStyle>;
}
