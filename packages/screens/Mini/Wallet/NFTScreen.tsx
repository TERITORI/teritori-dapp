import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import ListViewWithDropdown from "./components/ListViewWithDropdown";
import searchSvg from "../../../../assets/icons/search-gray.svg";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import MiniTextInput from "../components/MiniTextInput";

const nftData = [
  {
    id: "9303jdk",
    title: "Collection Name 1",
    cards: [
      {
        id: "nidfijdf0kp",
        name: "Card 1",
      },
      {
        id: "nidfijdfasdf=9-0",
        name: "Card 2",
      },
      {
        id: "nidfijdfsdfdfdf3093",
        name: "Card 3",
      },
    ],
  },
  {
    id: "9303jdk0j",
    title: "Collection Name 2",
    cards: [
      {
        id: "nidfijdf9039",
        name: "Card 1",
      },
    ],
  },
  {
    id: "9303jdk-=",
    title: "Collection Name 3",
    cards: [
      {
        id: "nidfijdfnid9d",
        name: "Card 1",
      },
    ],
  },
  {
    id: "9303jdk93j",
    title: "Collection Name 4",
    cards: [
      {
        id: "nidfijdf90393",
        name: "Card 1",
      },
      {
        id: "nidfijdfasdfnsp[]90",
        name: "Card 2",
      },
    ],
  },
  {
    id: "9303jdk930",
    title: "Collection Name 5",
    cards: [
      {
        id: "nidfijdfno03",
        name: "Card 1",
      },
    ],
  },
];

const NFTScreen: ScreenFC<"MiniWallets"> = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <SpacerColumn size={3} />

      <MiniTextInput
        placeholder="Search"
        icon={searchSvg}
        enableClearButton
        style={{ paddingVertical: 10 }}
      />

      <SpacerColumn size={3} />
      <FlatList
        ItemSeparatorComponent={() => <Separator />}
        showsVerticalScrollIndicator={false}
        data={nftData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <>
            <SpacerColumn size={index === 0 ? 1 : 2} />
            <ListViewWithDropdown open={index === 0} item={item} />
            <SpacerColumn size={2} />
          </>
        )}
      />
    </View>
  );
};

export default NFTScreen;
