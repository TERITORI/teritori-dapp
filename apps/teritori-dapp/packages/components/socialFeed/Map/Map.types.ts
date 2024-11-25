import { StyleProp, ViewStyle } from "react-native";

import { CustomLatLngExpression, PostCategory } from "@/utils/types/feed";

export interface MapProps {
  creatingPostLocation?: CustomLatLngExpression; // When the user is adding a location to a post he's creating
  creatingPostCategory?: PostCategory; // When the user is adding a location to a post he's creating
  consultedPostId?: string; // When the user want to consult a post on the map (By clicking on LocationButton)
  style?: StyleProp<ViewStyle>;
}
