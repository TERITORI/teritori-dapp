/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-void */
/* eslint-disable no-unused-expressions */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { groupBy, mapValues } = require("lodash");
const react_1 = require("react");
const react_native_1 = require("react-native");

const noop = () => {};
// Conversion of codepoints and surrogate pairs. See more here:
// https://mathiasbynens.be/notes/javascript-unicode
// https://mathiasbynens.be/notes/javascript-escapes#unicode-code-point
// and `String.fromCodePoint` on MDN
function charFromUtf16(utf16) {
  return String.fromCodePoint(...utf16.split("-").map((u) => "0x" + u));
}
function charFromEmojiObj(obj) {
  return charFromUtf16(obj.unified);
}
const CATEGORIES = [
  "Smileys & Emotion",
  "People & Body",
  "Animals & Nature",
  "Food & Drink",
  "Activities",
  "Travel & Places",
  "Objects",
  "Symbols",
  "Flags",
];

const DEFAULT_EMOJI_SIZE = 32;
const PADDING = 4;
const DEFAULT_COLUMNS = 7;
const ROWS_VISIBLE = DEFAULT_COLUMNS;
const EMOJI_GROUP_PADDING_BOTTOM = PADDING * 3;
const TOTAL_HEIGHT = DEFAULT_EMOJI_SIZE * ROWS_VISIBLE + 20;
const styles = react_native_1.StyleSheet.create({
  modal: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    backgroundColor: "#00000077",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  container: {
    backgroundColor: "white",
    padding: 0,
    borderRadius: 10,
    flexDirection: "column",
  },
  scrollerContainer: Object.assign(
    { minHeight: TOTAL_HEIGHT, maxHeight: TOTAL_HEIGHT },
    react_native_1.Platform.select({
      web: {
        overflowY: "hidden",
      },
    }),
  ),
  scroller: {
    flexDirection: "column",
    minHeight: TOTAL_HEIGHT,
    maxHeight: TOTAL_HEIGHT,
  },
  searchContainer: {
    position: "relative",
    flexDirection: "row",
  },
  search: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    height: 4 + 20 + 4,
    paddingHorizontal: 12,
    borderRadius: 3,
    color: "#2f2f2f",
    zIndex: 10,
  },
  searchIcon: {
    position: "absolute",
    left: 16,
    top: PADDING + 3 + 4,
    zIndex: 20,
  },
  headerText: {
    marginVertical: 6,
    color: "black",
    fontWeight: "bold",
    justifyContent: "center",
    textAlignVertical: "center",
  },
  categoryOuter: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  emojiGroup: {
    marginBottom: EMOJI_GROUP_PADDING_BOTTOM,
    alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  shortcutsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: PADDING,
  },
  shortcut: {
    padding: PADDING,
  },
});
class EmojiGroup extends react_1.PureComponent {
  render() {
    let _a;
    const emojis = this.props.emojis;
    const size = this.props.emojiSize || DEFAULT_EMOJI_SIZE;
    const style = {
      width: size,
      height: size,
      boxSizing: "content-box",
      fontSize: size * 0.8,
      textAlign: "center",
      lineHeight: size,
      margin: PADDING,
    };
    const cols = (_a = this.props.columns) !== null && _a !== void 0 ? _a : 7;
    const maxWidth = (size + PADDING * 2) * cols + 2;
    const minWidth = maxWidth;
    return (0, react_1.createElement)(
      react_native_1.View,
      { style: [styles.emojiGroup, { minWidth, maxWidth }] },
      ...emojis
        .filter((e) => !!e)
        .map((e) =>
          (0, react_1.createElement)(
            react_native_1.Text,
            {
              style: [style, this.props.emojiStyle],
              key: e,
              onPress: () => this.props.onEmojiSelected(e),
            },
            e,
          ),
        ),
    );
  }
}
class EmojiCategory extends react_1.PureComponent {
  render() {
    const {
      onEmojiSelected,
      emojiSize,
      emojiStyle,
      columns,
      category,
      emojisByCategory,
      localizedCategories,
      headerStyle,
    } = this.props;
    const emojis = emojisByCategory[category];
    const categoryText = localizedCategories
      ? localizedCategories[CATEGORIES.indexOf(category)]
      : category;
    return (0, react_1.createElement)(
      react_native_1.View,
      { style: styles.categoryOuter },
      (0, react_1.createElement)(
        react_native_1.Text,
        { style: [styles.headerText, headerStyle] },
        categoryText,
      ),
      (0, react_1.createElement)(EmojiGroup, {
        emojis,
        onEmojiSelected,
        emojiSize,
        emojiStyle,
        columns,
      }),
    );
  }
}
class SearchField extends react_1.PureComponent {
  render() {
    const { customStyle, onChanged } = this.props;
    return (0, react_1.createElement)(
      react_native_1.View,
      { style: styles.searchContainer },
      (0, react_1.createElement)(react_native_1.TextInput, {
        key: "b",
        style: [styles.search, customStyle],
        onChangeText: onChanged,
        autoFocus: false,
        multiline: false,
        returnKeyType: "search",
        underlineColorAndroid: "transparent",
      }),
    );
  }
}

function normalize(str) {
  return str
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ +/g, "")
    .replace(/_+/g, " ")
    .trim();
}
class EmojiModal extends react_1.PureComponent {
  constructor(props) {
    super(props);
    this.emojisByCategory = {};
    this.filteredEmojis = [];
    this.ref = (0, react_1.createRef)();
    this.viewabilityConfig = {
      minimumViewTime: 1,
      viewAreaCoveragePercentThreshold: 51,
    };
    this.renderItem = ({ item }) => {
      const { searchResults } = this.state;
      if (searchResults.length > 0) {
        return (0, react_1.createElement)(
          EmojiGroup,
          Object.assign(Object.assign({}, this.props), {
            emojis: searchResults,
          }),
        );
      } else {
        const category = item;
        return (0, react_1.createElement)(
          EmojiCategory,
          Object.assign(Object.assign({}, this.props), {
            emojisByCategory: this.emojisByCategory,
            category,
            key: category,
          }),
        );
      }
    };
    this.onSearchChanged = (input) => {
      if (input.length === 0) {
        if (this.state.searchResults.length > 0) {
          this.setState({ searchResults: [] });
        }
        return;
      }
      if (input.length < 2) {
        return;
      }
      const searchResults = this.filteredEmojis
        .map((emoji) => {
          const shortName = normalize(emoji.short_name);
          const query = normalize(input);
          const score =
            shortName === query
              ? 3
              : shortName.startsWith(query)
                ? 2
                : shortName.includes(query)
                  ? 1
                  : 0;
          emoji._score = score;
          return emoji;
        })
        .filter((emoji) => emoji._score > 0)
        .sort((a, b) => b._score - a._score)
        .map(charFromEmojiObj);
      if (searchResults.length === 0) searchResults.push("");
      this.setState({ searchResults });
    };
    this.onPressCategory = (category) => {
      let _a;
      // Scroll doesn't work on react-native-web due to bad FlatList support
      if (react_native_1.Platform.OS === "web") return;
      const index = CATEGORIES.indexOf(category);
      if (index >= 0) {
        (_a = this.ref.current) === null || _a === void 0
          ? void 0
          : _a.scrollToIndex({
              animated: true,
              index,
              viewPosition: 0,
              viewOffset: 0,
            });
      }
    };
    this.onPressBackground = () => {
      let _a, _b;
      (_b = (_a = this.props).onPressOutside) === null || _b === void 0
        ? void 0
        : _b.call(_a);
    };
    this.getItemLayout = (data, index) => {
      if ((data === null || data === void 0 ? void 0 : data[0]) === null)
        return { length: TOTAL_HEIGHT, offset: 0, index: 0 };
      return this.layouts[index];
    };
    this.onViewableItemsChanged = ({ viewableItems }) => {
      if (viewableItems.length === 0) return;
      const category = viewableItems[0].key;
      this.setState({ activeCategory: category });
    };
    this.state = { searchResults: [], activeCategory: CATEGORIES[0] };
    this.prepareEmojisByCategory();
    this.calculateLayouts(props);
  }
  prepareEmojisByCategory() {
    const emojiDB = require("./emoji.json");
    const blocklistedEmojis = ["white_frowning_face", "keycap_star", "eject"];
    this.filteredEmojis = emojiDB.filter((emoji) => {
      if (blocklistedEmojis.includes(emoji.short_name)) return false;
      if (react_native_1.Platform.OS === "android") {
        const addedIn = parseFloat(emoji.added_in);
        if (Number.isNaN(addedIn)) return true;
        if (addedIn < 2) return true;
        if (addedIn === 2) return react_native_1.Platform.Version >= 23;
        if (addedIn <= 4) return react_native_1.Platform.Version >= 24;
        if (addedIn <= 5) return react_native_1.Platform.Version >= 26;
        if (addedIn <= 11) return react_native_1.Platform.Version >= 28;
        else return react_native_1.Platform.Version >= 29;
      } else {
        return true;
      }
    });
    const groupedEmojis = groupBy(
      this.filteredEmojis,
      (emoji) => emoji.category,
    );
    this.emojisByCategory = mapValues(groupedEmojis, (group) =>
      group.map(charFromEmojiObj),
    );
  }
  calculateLayouts(props) {
    let heightsSoFar = 0;
    this.layouts = CATEGORIES.map((category, i) => {
      let _a, _b;
      const numEmojis = this.emojisByCategory[category].length;
      const numColumns =
        (_a = props.columns) !== null && _a !== void 0 ? _a : DEFAULT_COLUMNS;
      const emojiSize =
        (_b = props.emojiSize) !== null && _b !== void 0
          ? _b
          : DEFAULT_EMOJI_SIZE;
      const numRows = Math.ceil(numEmojis / numColumns);
      const headerHeight = 16 + 2 * PADDING;
      const offset = heightsSoFar;
      const rowHeight = emojiSize + 2 * PADDING;
      const bottomPadding = EMOJI_GROUP_PADDING_BOTTOM;
      const height = headerHeight + numRows * rowHeight + bottomPadding;
      heightsSoFar += height;
      return { length: height, offset, index: i };
    });
  }
  render() {
    const {
      modalStyle,
      backgroundStyle,
      containerStyle,
      scrollStyle,
      searchStyle,
      shortcutColor,
    } = this.props;
    const { searchResults } = this.state;
    return (0, react_1.createElement)(
      react_native_1.View,
      { style: [styles.modal, modalStyle] },
      (0, react_1.createElement)(
        react_native_1.View,
        { style: [styles.container, containerStyle] },
        (0, react_1.createElement)(SearchField, {
          customStyle: searchStyle,
          onChanged: this.onSearchChanged,
          iconColor: shortcutColor,
        }),
        (0, react_1.createElement)(
          react_native_1.View,
          { style: styles.scrollerContainer },
          (0, react_1.createElement)(react_native_1.FlatList, {
            ref: this.ref,
            data: searchResults.length > 0 ? [null] : CATEGORIES,
            horizontal: false,
            numColumns: 1,
            onEndReachedThreshold:
              react_native_1.Platform.OS === "web" ? 1 : 1000,
            onScrollToIndexFailed: noop,
            style: [styles.scroller, scrollStyle],
            initialNumToRender: 1,
            maxToRenderPerBatch: 1,
            keyExtractor: (category) => category,
            getItemLayout: this.getItemLayout,
            onViewableItemsChanged: this.onViewableItemsChanged,
            viewabilityConfig: this.viewabilityConfig,
            renderItem: this.renderItem,
          }),
        ),
      ),
      (0, react_1.createElement)(
        react_native_1.TouchableWithoutFeedback,
        { onPress: this.onPressBackground },
        (0, react_1.createElement)(react_native_1.View, {
          style: [styles.background, backgroundStyle],
        }),
      ),
    );
  }
}
exports.default = EmojiModal;
//# sourceMappingURL=index.js.map
