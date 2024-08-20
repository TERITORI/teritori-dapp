import { difference } from "lodash";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FlatList,
  ImageStyle,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

import {
  Collection,
  CollectionsRequest,
} from "@/api/marketplace/v1/marketplace";
import addCircleSVG from "@/assets/icons/add-circle.svg";
import dotSVG from "@/assets/icons/dot-more.svg";
import downSVG from "@/assets/icons/down.svg";
import trashSVG from "@/assets/icons/trash-white.svg";
import upSVG from "@/assets/icons/up.svg";
import { BrandText } from "@/components/BrandText";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SVG } from "@/components/SVG";
import { BoxStyle } from "@/components/boxes/Box";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { CollectionGallery } from "@/components/collections/CollectionGallery";
import { SearchInput } from "@/components/sorts/SearchInput";
import { useCollections } from "@/hooks/useCollections";
import { SelectableCollection } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadAdministrationOverview/component/MarketingEdition/CollectionsEdition/SelectableCollection";
import { EditButton } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadAdministrationOverview/component/MarketingEdition/EditButton";
import { neutral00, neutral33 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const MD_BREAKPOINT = 820;

export const CollectionsEdition: FC<{
  req: CollectionsRequest;
  filter?: (c: Collection) => boolean;
}> = ({ req, filter }) => {
  const { width } = useWindowDimensions();
  const [isEditing, setIsEditing] = useState(false);
  const [openedList, setOpenedList] = useState<number>(-1);
  const [isAddMoreOpen, setIsAdMoreOpen] = useState(false);
  const { collections } = useCollections(req, filter);

  // TODO: Better pattern to init editedCollections with collections value. I'm dumb tonight sorry
  const [editedCollections, setEditedCollections] = useState<Collection[]>([]);
  const [isInit, setIsInit] = useState(false);
  useEffect(() => {
    if (!isInit) {
      setEditedCollections(collections);
      setIsInit(true);
    }
  }, [collections, isInit]);

  const selectableCollections = useMemo(
    () => difference(collections, editedCollections),
    [editedCollections, collections],
  );

  const removeCollection = (index: number) => {
    setEditedCollections((collections) =>
      collections.filter((_, i) => i !== index),
    );
  };

  const changeCollection = (index: number, newCollection: Collection) => {
    setEditedCollections((collections) =>
      collections.map((collection, i) => {
        if (i === index) {
          return newCollection;
        } else return collection;
      }),
    );
  };

  const addCollection = (collectionToAdd: Collection) => {
    setEditedCollections((collections) => [...collections, collectionToAdd]);
  };

  return (
    <View style={{ flexDirection: width >= MD_BREAKPOINT ? "row" : "column" }}>
      <EditButton
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        saveChanges={() => {
          // TODO
        }}
      />

      {isEditing ? (
        <>
          {editedCollections?.map((collection: Collection, index: number) => (
            <CollectionItem
              key={index}
              collection={collection}
              index={index}
              openedList={openedList}
              selectableCollections={selectableCollections}
              setOpenedList={setOpenedList}
              removeCollection={() => removeCollection(index)}
              changeCollection={(newCollection) =>
                changeCollection(index, newCollection)
              }
            />
          ))}
          {editedCollections?.length < 5 && !!selectableCollections.length ? (
            <TertiaryBox
              style={{
                width: width >= MD_BREAKPOINT ? "19%" : "100%",
                marginTop: 52,
                padding: 12,
                height: 325,
              }}
            >
              {isAddMoreOpen ? (
                <View>
                  <TouchableOpacity onPress={() => setIsAdMoreOpen(false)}>
                    <SVG
                      source={downSVG}
                      style={{
                        marginBottom: layout.spacing_x2,
                        alignSelf: "flex-end",
                      }}
                    />
                  </TouchableOpacity>
                  <CollectionSearch
                    selectableCollections={selectableCollections}
                    selectCollection={addCollection}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsAdMoreOpen(true)}
                  style={plusBox}
                >
                  <View style={dotBackground}>
                    <SVG source={addCircleSVG} />
                  </View>
                  <BrandText style={[fontSemibold14, { marginLeft: 5 }]}>
                    Add more
                  </BrandText>
                </TouchableOpacity>
              )}
            </TertiaryBox>
          ) : null}
        </>
      ) : (
        <CollectionGallery linkToMint filter={filter} req={req} />
      )}
    </View>
  );
};

const CollectionItem: FC<{
  collection: Collection;
  index: number;
  openedList: number;
  setOpenedList: Dispatch<SetStateAction<number>>;
  selectableCollections: Collection[];
  changeCollection: (newCollection: Collection) => void;
  removeCollection: () => void;
}> = ({
  collection,
  index,
  openedList,
  setOpenedList,
  selectableCollections,
  changeCollection,
  removeCollection,
}) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[viewBox, { width: width >= MD_BREAKPOINT ? "19%" : "100%" }]}>
      <View style={insideBoxMap}>
        <View style={dotBackground}>
          <BrandText style={[fontSemibold14]}>{index + 1}</BrandText>
        </View>
        <View>
          <SVG source={dotSVG} />
        </View>
      </View>
      <TertiaryBox style={herosLisBox}>
        <TouchableOpacity
          onPress={() => setOpenedList((old) => (old === index ? -1 : index))}
          style={toggleBox}
        >
          <BrandText style={[fontSemibold14]}>
            {collection.collectionName}
          </BrandText>
          <View>
            {openedList === index ? (
              <SVG source={downSVG} />
            ) : (
              <SVG source={upSVG} />
            )}
          </View>
        </TouchableOpacity>

        {openedList === index ? (
          <CollectionSearch
            selectableCollections={selectableCollections}
            selectCollection={changeCollection}
          />
        ) : (
          <View>
            <OptimizedImage
              sourceURI={collection.imageUri}
              style={imageBgStyle}
              width={250}
              height={250}
            />

            <TouchableOpacity style={trashBtnBox} onPress={removeCollection}>
              <SVG source={trashSVG} />
            </TouchableOpacity>
          </View>
        )}
      </TertiaryBox>
    </View>
  );
};

const CollectionSearch: FC<{
  selectableCollections: Collection[];
  selectCollection: (collection: Collection) => void;
}> = ({ selectableCollections, selectCollection }) => {
  return (
    <PrimaryBox
      style={{
        height: 260,
        width: "100%",
      }}
    >
      <View style={{ margin: 10 }}>
        <SearchInput
          handleChangeText={() => {
            // TODO
          }}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={selectableCollections}
          renderItem={({ index, item }) => (
            <SelectableCollection
              index={index}
              onPress={() => selectCollection(item)}
              collection={item}
            />
          )}
          keyExtractor={(item) => item.id}
          style={{
            marginTop: 16,
            marginLeft: 5,
          }}
          contentContainerStyle={{
            height: 180,
          }}
        />
      </View>
    </PrimaryBox>
  );
};

const dotBackground: ViewStyle = {
  backgroundColor: neutral33,
  height: 35,
  width: 35,
  borderRadius: 100,
  alignItems: "center",
  justifyContent: "center",
};

const trashBtnBox: ViewStyle = {
  backgroundColor: neutral00,
  height: 35,
  width: 35,
  borderRadius: 100,
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  right: 16,
  bottom: 10,
};

const insideBoxMap: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  height: 40,
};

const toggleBox: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
};

const viewBox: ViewStyle = {
  width: "19%",
  marginHorizontal: 8,
};

const herosLisBox: BoxStyle = {
  padding: 12,
  marginTop: 12,
  height: 325,
};

const plusBox: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
};

const imageBgStyle: ImageStyle = {
  alignItems: "center",
  justifyContent: "center",
  height: 260,
  width: "100%",
};
