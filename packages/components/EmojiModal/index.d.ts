import { PureComponent } from "react";
import { View, ViewStyle, TextStyle } from "react-native";
declare type LocalizedCategories = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];
export default class EmojiModal extends PureComponent<
  {
    onEmojiSelected: (e: string | null) => void;
    onPressOutside?: () => void;
    columns?: number;
    localizedCategories?: LocalizedCategories;
    emojiSize?: number;
    emojiStyle?: TextStyle;
    modalStyle?: ViewStyle;
    backgroundStyle?: ViewStyle;
    containerStyle?: ViewStyle;
    scrollStyle?: ViewStyle;
    headerStyle?: TextStyle;
    searchStyle?: ViewStyle;
    shortcutColor?: any;
    activeShortcutColor?: any;
  },
  {
    searchResults: string[];
    activeCategory: string;
  }
> {
  constructor(props: any);
  private emojisByCategory;
  private filteredEmojis;
  private layouts;
  private readonly ref;
  private readonly viewabilityConfig;
  private prepareEmojisByCategory;
  private calculateLayouts;
  private renderItem;
  private onSearchChanged;
  private onPressCategory;
  private onPressBackground;
  getItemLayout: (
    data: unknown[] | null | undefined,
    index: number,
  ) => {
    length: number;
    offset: number;
    index: number;
  };
  onViewableItemsChanged: ({ viewableItems }: any) => void;
  render(): import("react").CElement<import("react-native").ViewProps, View>;
}
export {};
