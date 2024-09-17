import { StyleProp, ViewStyle } from "react-native";

import { CustomLatLngExpression, PostCategory } from "@/utils/types/feed";

export interface MapProps {
  creatingPostLocation?: CustomLatLngExpression; // When the user is adding a location to a post he's creating
  creatingPostCategory?: PostCategory; // When the user is adding a location to a post he's creating
  locationToCenter?: CustomLatLngExpression; // When the user want to see a post's position on the Map (From Jungle Feed for example)
  style?: StyleProp<ViewStyle>;
}
