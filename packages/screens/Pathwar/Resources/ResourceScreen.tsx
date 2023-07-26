import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from "react-native";

import { ResourceBox } from "./ResourceBox";
import resourceLogo from "../../../../assets/LogoPathwarOverview/ResourceLogo.svg";
import resourceBanner from "../../../../assets/banners/resourcesBanner.png";
import { Resources } from "../../../api/pathwar/v1/pathwar";
import { BrandText } from "../../../components/BrandText";
import { DropDownFilter } from "../../../components/Pathwar/Resource/DropDownFilter";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SearchInput } from "../../../components/sorts/SearchInput";
import { SpacerColumn } from "../../../components/spacer";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import { useAppNavigation } from "../../../utils/navigation";
import { secondaryColor, neutral00 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../../utils/style/fonts";
import {
  layout,
  screenContentMaxWidthLarge,
} from "../../../utils/style/layout";
import { CategoryFilter, TagFilter } from "../types";

export const ResourceScreen: React.FC = () => {
  const { height } = useMaxResolution({ isLarge: true });
  const navigation = useAppNavigation();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState<string>("");
  const data = [
    {
      id: 1,
      title: "title",
      description:
        "things and stuff things and stuff things and stuff things and stuff things and stuff things and stuff things and stuff things and stuff things and stuff things and stuff",

      category: [{ id: 1, text: "video" }],
      thumbnail:
        "https://cloudflare-ipfs.com/ipfs/Qmcd8DcTCBqsDgHq21Pxbu2FcdDKnfQjqNfS6VNrJkyxkT",
      url: "https://cloudflare-ipfs.com/ipfs/QmQakEBJ9aevUZz7eYH2jtqfb9V5D8FkLeH9Bwr47wVHYH",
      tags: [
        {
          id: 1,
          text: "Challenges",
        },
      ],
    },
    {
      id: 1,
      title: "What is Gno",
      description:
        "Gnoland is a blockchain L1 project started in 2020 by Jae Kwon, co-founder of Cosmos and Tendermint. Its goal is to create a decentralized, secure and scalable smart contract platform for people to create important applications, especially against censorship.",
      thumbnail:
        "https://cloudflare-ipfs.com/ipfs/Qmcd8DcTCBqsDgHq21Pxbu2FcdDKnfQjqNfS6VNrJkyxkT",
      category: [{ id: 1, text: "article" }],
      url: "https://gnoland.space/docs/what-is-gno",
      tags: [
        {
          id: 1,
          text: "Gno.land",
        },
      ],
    },
  ] as Resources[];

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter[]>(
    data.flatMap((resource) =>
      resource.category.map((category) => {
        return { ...category, selected: true };
      })
    )
  );
  const [tagFilter, setTagFilter] = useState<TagFilter[]>(
    data.flatMap((resource) =>
      resource.tags.map((tag) => {
        return { ...tag, selected: true };
      })
    )
  );

  return (
    <ScreenContainer
      responsive
      isLarge
      footerChildren={<></>}
      headerChildren={<BrandText style={fontSemibold20}>Resources</BrandText>}
      onBackPress={() => navigation.navigate("Pathwar")}
    >
      <View>
        <ImageBackground
          source={resourceBanner}
          style={{
            height: 330,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SVG source={resourceLogo} />
        </ImageBackground>
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginTop: layout.padding_x1_5,
          zIndex: 2,
        }}
      >
        <DropDownFilter
          categories={categoryFilter}
          tags={tagFilter}
          setCategoryFilter={setCategoryFilter}
          setTagFilter={setTagFilter}
        />

        <View style={{ alignItems: "flex-start" }}>
          <SearchInput
            handleChangeText={setSearch}
            borderRadius={layout.borderRadius}
            height={45}
            style={{
              width: isMobile ? "100%" : 270,
              backgroundColor: neutral00,
              // position: "absolute",
              // top: -93,
              // right: -122,
            }}
          />
        </View>
        <View
          style={{
            // hide as we don't have design for this
            // @ts-ignore
            visibility: "hidden",
          }}
        >
          <TouchableOpacity style={{ alignItems: "flex-start" }}>
            <TertiaryBox mainContainerStyle={{ borderColor: secondaryColor }}>
              <View
                style={{ flexDirection: "row", margin: layout.padding_x1_5 }}
              >
                <BrandText
                  style={[{ marginRight: layout.padding_x1 }, fontSemibold14]}
                >
                  +
                </BrandText>
                <BrandText style={fontSemibold14}>Suggest content</BrandText>
              </View>
            </TertiaryBox>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: layout.padding_x2_5,
        }}
      >
        <FlatList
          data={data
            .filter((resource) =>
              resource.title.toLowerCase().includes(search.toLowerCase())
            )
            .filter(
              (resource) =>
                tagFilter
                  .filter((tag) => tag.selected)
                  .filter((e) =>
                    resource.tags.some((resource) => resource.text === e.text)
                  ).length > 0 &&
                categoryFilter
                  .filter((tag) => tag.selected)
                  .filter((e) =>
                    resource.category.some(
                      (resource) => resource.text === e.text
                    )
                  ).length > 0
            )}
          style={{
            width: "100%",
          }}
          contentContainerStyle={{
            maxWidth: screenContentMaxWidthLarge,
            maxHeight: height,
          }}
          showsHorizontalScrollIndicator={false}
          columnWrapperStyle={{ flexWrap: "wrap", flex: 1, marginTop: 5 }}
          numColumns={99} // needed to deal with wrap via css
          ItemSeparatorComponent={() => <SpacerColumn size={2} />}
          ListEmptyComponent={
            <BrandText style={[fontSemibold20, { textAlign: "center" }]}>
              No results found.
            </BrandText>
          }
          renderItem={({ item, index }) => {
            return <ResourceBox data={item} key={index} />;
          }}
        />
      </View>
    </ScreenContainer>
  );
};
