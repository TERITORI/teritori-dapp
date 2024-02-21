import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";
import { DraxList, DraxProvider } from "react-native-drax";
import { useSelector } from "react-redux";

import { DAppStoreMenuItem } from "./DAppStoreMenuItems";

import { BrandText } from "@/components/BrandText";
import { Separator } from "@/components/separators/Separator";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import {
  selectAvailableApps,
  selectCheckedApps,
  setCheckedApp,
  setSelectedApps,
} from "@/store/slices/dapps-store";
import { useAppDispatch } from "@/store/store";
import { getValuesFromId, SEPARATOR } from "@/utils/dapp-store";
import { RouteName } from "@/utils/navigation";
import { layout } from "@/utils/style/layout";
import { dAppType } from "@/utils/types/dapp-store";

type Props = {
  isEditing: boolean;
};

export const DAppsList = ({ isEditing }: Props) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const { width: windowsWidth } = useWindowDimensions();
  const availableApps = useSelector(selectAvailableApps);
  const selectedApps = useSelector(selectCheckedApps);

  const coreDApps = availableApps["teritori-core-apps"];
  const externalApps = availableApps["bookmarks"];
  const staking = availableApps["staking"];
  const topApps = availableApps["top-apps"];

  const [selectedAppsFromValues, setSelectedAppsFromValues] = useState<
    dAppType[]
  >([]);
  const [remainingToSelectApps, setRemainingToSelectApps] = useState<
    dAppType[]
  >([]);

  const selectedOptionsIds: string[] = useMemo(() => {
    return selectedApps.reduce((acc, app) => {
      const { appId, groupKey } = getValuesFromId(app);
      if (availableApps[groupKey]?.options[appId]?.alwaysOn) {
        return acc;
      }
      acc.push(availableApps[groupKey]?.options[appId]?.id);
      return acc;
    }, [] as string[]);
  }, [availableApps, selectedApps]);

  const getOptions = useCallback(
    (item: typeof externalApps) => {
      if (item?.options && Object.values(item?.options).length) {
        return Object.values(item.options).filter(
          (x) => !selectedOptionsIds.includes(x.id) && !x.alwaysOn,
        );
      }
      return [];
    },
    [selectedOptionsIds],
  );

  useEffect(() => {
    if (selectedApps) {
      const selected = selectedApps
        .map((app) => {
          const { appId, groupKey } = getValuesFromId(app);
          if (availableApps[groupKey]?.options[appId]?.alwaysOn) {
            return undefined;
          }
          return availableApps[groupKey]?.options[appId];
        })
        .filter(Boolean) as dAppType[];

      if (selected) {
        setSelectedAppsFromValues(selected);
      }
    }
  }, [selectedApps, availableApps]);

  useEffect(() => {
    if (selectedApps) {
      const remainingToSelectApps = [
        ...getOptions(topApps),
        ...getOptions(staking),
        ...getOptions(externalApps),
      ];
      if (remainingToSelectApps) {
        setRemainingToSelectApps(remainingToSelectApps);
      }
    }
  }, [topApps, staking, externalApps, selectedApps, getOptions]);

  const alwaysOnApps = Object.values(coreDApps.options)
    .concat(Object.values(topApps.options))
    .filter((x: dAppType) => x.alwaysOn);

  const handleClick = (groupKey: string, id: string) => {
    const draggableId = `${groupKey}${SEPARATOR}${id}`;

    const action = {
      draggableId,
      isChecked: !selectedApps.includes(draggableId),
    };
    dispatch(setCheckedApp(action));
  };

  const renderNoDApps = () => (
    <View style={{ marginVertical: layout.spacing_x3 }}>
      <BrandText>No DApps</BrandText>
    </View>
  );
  return (
    <View style={{ paddingBottom: isEditing ? 100 : 0 }}>
      <FlatList
        data={alwaysOnApps}
        renderItem={({ item, index }) => {
          return (
            <DAppStoreMenuItem
              icon={item.icon}
              title={item.title}
              isAdded
              onPress={() => {
                if (!["External", "ComingSoon"].includes(item.route)) {
                  navigation.replace(item.route as RouteName);
                }
              }}
            />
          );
        }}
        keyExtractor={(item, idx) => `${item?.title}-${idx}`}
      />
      <DraxProvider style={{ width: windowsWidth - 30 }}>
        <DraxList
          data={selectedAppsFromValues.filter(
            (item) => item.route !== "External",
          )}
          onItemReorder={({ fromIndex, toIndex }) => {
            const newData = selectedApps.slice();
            newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
            dispatch(setSelectedApps(newData));
          }}
          itemsDraggable={isEditing}
          renderItemContent={({ item, index }) => {
            return (
              <DAppStoreMenuItem
                icon={item?.icon || ""}
                title={item?.title || ""}
                subTitle={item?.description}
                isEditing={isEditing}
                onPress={() => {
                  if (!["External", "ComingSoon"].includes(item.route)) {
                    navigation.replace(item.route as RouteName);
                  }
                }}
                isAdded
                onActionPress={() =>
                  item && handleClick(item.groupKey, item.id)
                }
              />
            );
          }}
          keyExtractor={(item, idx) => `${item?.id}-${idx}`}
          ListEmptyComponent={renderNoDApps}
        />
      </DraxProvider>
      <Separator />
      {isEditing && (
        <FlatList
          data={remainingToSelectApps.filter(
            (item) => item.route !== "External",
          )}
          renderItem={({ item, index }) => {
            return (
              <DAppStoreMenuItem
                icon={item.icon}
                title={item.title}
                subTitle={item.description}
                isEditing={isEditing}
                onPress={() => alert(item.description)}
                isAdded={false}
                onActionPress={() =>
                  item && handleClick(item.groupKey, item.id)
                }
              />
            );
          }}
          ListEmptyComponent={renderNoDApps}
          keyExtractor={(item, idx) => `${item?.id}-${idx}`}
        />
      )}
    </View>
  );
};
