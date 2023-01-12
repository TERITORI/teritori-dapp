import React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { BrandText } from "../../../components/BrandText";
import {
  selectCheckedApps,
  selectAvailableApps,
  setOrder,
} from "../../../store/slices/dapps-store";
import { useAppDispatch } from "../../../store/store";
import { neutral67 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { getValuesFromId } from "../query";
import { SelectedDraggable } from "./SelectedDraggable";

export const LeftRail = () => {
  const dispatch = useAppDispatch();
  const selectedApps = useSelector(selectCheckedApps);
  const availableApps = useSelector(selectAvailableApps);
  const dropAreaId = "left-rail";

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const action = {
      destination: destination.index,
      source: source.index,
      draggableId,
    };
    dispatch(setOrder(action));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={dropAreaId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              flex: 1,
              marginLeft: layout.padding_x4,
              marginRight: layout.padding_x2,
              paddingTop: layout.padding_x4,
              maxWidth: 300,
              height: "100%",
            }}
          >
            <BrandText style={{ height: 32 }}>dApps in sidebar</BrandText>
            {selectedApps.length > 0 ? (
              <View
                style={{
                  flex: 1,
                  minHeight: 250,
                  marginRight: layout.padding_x4,
                  paddingTop: layout.padding_x4,
                }}
              >
                {selectedApps.map((option, index) => {
                  const { appId, groupKey } = getValuesFromId(option);
                  return (
                    <SelectedDraggable
                      option={availableApps[groupKey].options[appId]}
                      index={index}
                      key={index}
                    />
                  );
                })}
                {provided.placeholder}
              </View>
            ) : (
              <BrandText
                style={{
                  fontSize: 13,
                  color: neutral67,
                  marginTop: layout.padding_x1_5,
                  display: "flex",
                }}
              >
                No dApps added to the list
              </BrandText>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
