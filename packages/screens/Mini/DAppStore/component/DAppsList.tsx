import React, { useState } from "react";
import { FlatList, View, useWindowDimensions } from "react-native";
import { DraxList, DraxProvider } from "react-native-drax";

import { DAppStoreMenuItem } from "./DAppStoreMenuItems";
import astroportPNG from "../../../../../assets/icons/networks/Astroport.png";
import axelarPNG from "../../../../../assets/icons/networks/axelar.png";
import { BrandText } from "../../../../components/BrandText";
import { Separator } from "../../../../components/separators/Separator";
import { layout } from "../../../../utils/style/layout";

type Props = {
  isEditing: boolean;
  togggleEdting: () => void;
};

const addedList = [
  {
    id: 1,
    icon: axelarPNG,
    title: "Axelar Network",
    subTitle: "Secure building",
  },
  {
    id: 2,
    icon: astroportPNG,
    title: "Powerful DEX",
    subTitle: "Powerful DEX",
  },
];

const optionsList = [
  {
    id: 3,
    icon: axelarPNG,
    title: "Axelar Network",
    subTitle: "Secure building 3",
  },
  {
    id: 4,
    icon: astroportPNG,
    title: "Powerful DEX",
    subTitle: "Powerful DEX 4",
  },
  {
    id: 5,
    icon: axelarPNG,
    title: "Axelar Network",
    subTitle: "Secure building 5",
  },
  {
    id: 6,
    icon: astroportPNG,
    title: "Powerful DEX",
    subTitle: "Powerful DEX 6",
  },
  {
    id: 7,
    icon: axelarPNG,
    title: "Axelar Network",
    subTitle: "Secure building 7",
  },
  {
    id: 8,
    icon: astroportPNG,
    title: "Powerful DEX",
    subTitle: "Powerful DEX 8",
  },
  {
    id: 9,
    icon: axelarPNG,
    title: "Axelar Network",
    subTitle: "Secure building 9",
  },
  {
    id: 10,
    icon: astroportPNG,
    title: "Powerful DEX",
    subTitle: "Powerful DEX 10",
  },
];

export const DAppsList = ({ isEditing, togggleEdting }: Props) => {
  const { width: windowsWidth } = useWindowDimensions();
  const [addedDApps, setAddedDApps] = useState(addedList);
  const [optionsDApps, setOptionsDApps] = useState(optionsList);

  const onRemoveDApps = (item: (typeof addedDApps)[0]) => {
    setAddedDApps(addedDApps.filter((x) => x.id !== item.id));
    if (item) {
      setOptionsDApps((prev) => [item, ...prev]);
    }
  };

  const onAddDApps = (item: (typeof addedDApps)[0]) => {
    setOptionsDApps(optionsDApps.filter((x) => x.id !== item.id));
    if (item) {
      setAddedDApps((prev) => [...prev, item]);
    }
  };
  const renderNoDApps = () => (
    <View style={{ marginVertical: layout.spacing_x3 }}>
      <BrandText>No DApps</BrandText>
    </View>
  );
  return (
    <View style={{ paddingBottom: isEditing ? 100 : 0 }}>
      <DraxProvider style={{ width: windowsWidth - 30 }}>
        <DraxList
          data={addedDApps}
          onItemReorder={({ fromIndex, toIndex }) => {
            const newData = addedDApps.slice();
            newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
            setAddedDApps(newData);
          }}
          itemsDraggable={isEditing}
          renderItemContent={({ item, index }) => {
            return (
              <DAppStoreMenuItem
                icon={item.icon}
                title={item.title}
                subTitle={item.subTitle}
                isEditing={isEditing}
                onPress={() => alert(item.subTitle)}
                isAdded
                onActionPress={() => onRemoveDApps(item)}
              />
            );
          }}
          keyExtractor={(item, idx) => `${item.id}-${idx}`}
          ListEmptyComponent={renderNoDApps}
        />
      </DraxProvider>
      <Separator />
      <FlatList
        data={optionsDApps}
        renderItem={({ item, index }) => {
          return (
            <DAppStoreMenuItem
              icon={item.icon}
              title={item.title}
              subTitle={item.subTitle}
              isEditing={isEditing}
              onPress={() => alert(item.subTitle)}
              isAdded={false}
              onActionPress={() => onAddDApps(item)}
            />
          );
        }}
        ListEmptyComponent={renderNoDApps}
        keyExtractor={(item, idx) => `${item?.id}-${idx}`}
      />
    </View>
  );
};
