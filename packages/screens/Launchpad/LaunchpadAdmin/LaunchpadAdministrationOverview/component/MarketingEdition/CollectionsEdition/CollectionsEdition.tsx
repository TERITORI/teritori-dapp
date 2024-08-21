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
import leftSVG from "@/assets/icons/chevron-left.svg";
import rightSVG from "@/assets/icons/chevron-right.svg";
import downSVG from "@/assets/icons/down.svg";
import trashSVG from "@/assets/icons/trash-white.svg";
import upSVG from "@/assets/icons/up.svg";
import { BrandText } from "@/components/BrandText";
import { CollectionView } from "@/components/CollectionView";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SVG } from "@/components/SVG";
import { BoxStyle } from "@/components/boxes/Box";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { GridList } from "@/components/layout/GridList";
import { SearchInput } from "@/components/sorts/SearchInput";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useCollections } from "@/hooks/useCollections";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { SelectableCollection } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadAdministrationOverview/component/MarketingEdition/CollectionsEdition/SelectableCollection";
import { EditButton } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadAdministrationOverview/component/MarketingEdition/EditButton";
import { neutral00, neutral33 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const MD_BREAKPOINT = 820;
const ALL_LISTS_CLOSED = -1;
const ADD_MORE_LIST_OPENED = -2;

export const CollectionsEdition: FC<{
  req: CollectionsRequest;
  filter?: (c: Collection) => boolean;
}> = ({ req, filter }) => {
  const { width: windowWidth } = useWindowDimensions();
  const { width } = useMaxResolution();
  const [isEditing, setIsEditing] = useState(false);
  const { collections } = useCollections(req, filter);
  const [openedList, setOpenedList] = useState<number>(ALL_LISTS_CLOSED);

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
    setOpenedList(ALL_LISTS_CLOSED);
    setEditedCollections((collections) =>
      collections.map((collection, i) => {
        if (i === index) {
          return newCollection;
        } else return collection;
      }),
    );
  };

  const addCollection = (collectionToAdd: Collection) => {
    setOpenedList(ALL_LISTS_CLOSED);
    setEditedCollections((collections) => [...collections, collectionToAdd]);
  };

  return (
    <View style={{ width, alignSelf: "center" }}>
      <EditButton
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onPressSave={() => {
          // TODO
        }}
        onPressCancel={() => {
          // TODO
        }}
      />
      <SpacerColumn size={2} />
      {isEditing ? (
        <View
          style={{
            flexDirection: windowWidth >= MD_BREAKPOINT ? "row" : "column",
          }}
        >
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
              onPressMoveLeft={() => {
                setEditedCollections((editedCollections) => {
                  const collections = Array.from(editedCollections);
                  collections[index - 1] = collection;
                  collections[index] = editedCollections[index - 1];
                  return collections;
                });
              }}
              isMoveLeftDisabled={index === 0}
              onPressMoveRight={() => {
                setEditedCollections((editedCollections) => {
                  const collections = Array.from(editedCollections);
                  collections[index + 1] = collection;
                  collections[index] = editedCollections[index + 1];
                  return collections;
                });
              }}
              isMoveRightDisabled={index === editedCollections.length - 1}
            />
          ))}
          {editedCollections?.length < 5 && !!selectableCollections.length ? (
            <TertiaryBox
              style={{
                width: windowWidth >= MD_BREAKPOINT ? "19%" : "100%",
                marginTop: 52,
                padding: 12,
                height: 325,
              }}
            >
              {openedList === ADD_MORE_LIST_OPENED ? (
                <View>
                  <TouchableOpacity
                    onPress={() => setOpenedList(ALL_LISTS_CLOSED)}
                  >
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
                    selectCollection={(collection) => addCollection(collection)}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setOpenedList(ADD_MORE_LIST_OPENED)}
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
        </View>
      ) : (
        <GridList<Collection>
          data={collections}
          minElemWidth={250}
          keyExtractor={(item) => item.id}
          // onEndReached={handleEndReached}
          noFixedHeight
          renderItem={(props, width) => (
            <CollectionView
              item={props.item}
              // linkToMint={linkToMint}
              mintState={req.mintState}
              width={width}
            />
          )}
        />
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
  onPressMoveLeft: () => void;
  onPressMoveRight: () => void;
  isMoveLeftDisabled: boolean;
  isMoveRightDisabled: boolean;
}> = ({
  collection,
  index,
  openedList,
  setOpenedList,
  selectableCollections,
  changeCollection,
  removeCollection,
  onPressMoveLeft,
  onPressMoveRight,
  isMoveLeftDisabled,
  isMoveRightDisabled,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  return (
    <View
      style={[
        viewBox,
        { width: windowWidth >= MD_BREAKPOINT ? "19%" : "100%" },
      ]}
    >
      <View style={insideBoxMap}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={dotBackground}>
            <BrandText style={[fontSemibold14]}>{index + 1}</BrandText>
          </View>
          <SpacerRow size={1} />
          <CustomPressable
            style={[leftRightButton, isMoveLeftDisabled && { opacity: 0.5 }]}
            disabled={isMoveLeftDisabled}
            onPress={onPressMoveLeft}
          >
            <SVG source={leftSVG} style={{ width: 16, height: 16 }} />
          </CustomPressable>
          <SpacerRow size={1} />
          <CustomPressable
            style={[leftRightButton, isMoveRightDisabled && { opacity: 0.5 }]}
            disabled={isMoveRightDisabled}
            onPress={onPressMoveRight}
          >
            <SVG source={rightSVG} style={{ width: 16, height: 16 }} />
          </CustomPressable>
        </View>
      </View>
      <TertiaryBox style={herosLisBox}>
        <TouchableOpacity
          onPress={() =>
            setOpenedList((old) => (old === index ? ALL_LISTS_CLOSED : index))
          }
          style={toggleBox}
          disabled={!selectableCollections.length}
        >
          <BrandText style={[fontSemibold14]}>
            {collection.collectionName}
          </BrandText>
          <View style={!selectableCollections.length && { opacity: 0.5 }}>
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
  // TODO: Refacto this to have cards like CollectionView
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

const leftRightButton: ViewStyle = {
  borderRadius: 999,
  width: 24,
  height: 24,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: neutral33,
};
