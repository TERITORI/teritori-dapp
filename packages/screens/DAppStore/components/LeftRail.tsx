import React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { BrandText } from "../../../components/BrandText";
import { getSelectedApps, setOrder } from "../../../store/slices/dapps-store";
import { useAppDispatch } from "../../../store/store";
import { neutral67 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { dAppType } from "../types";
import { SelectedDraggable } from "./SelectedDraggable";

export const LeftRail = () => {
  const dispatch = useAppDispatch();
  const selectedApps = useSelector(getSelectedApps);
  const sortStrategy = (a: dAppType, b: dAppType) =>
    a.order < b.order ? -1 : 1;

  const dropAreaId = "left-rail";

  const onDragEnd = (result: DropResult) => {
    const separator = "*SEPARATOR*";
    const separatorLen = separator.length;

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

    const offset = draggableId.indexOf(separator);
    const appId = draggableId.substring(offset + separatorLen);
    const groupKey = draggableId.substring(0, offset);

    const action = {
      appId,
      groupKey,
      order: destination.index + 1,
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
            }}
          >
            <BrandText style={{ height: 32 }}>dApps in sidebar</BrandText>
            {selectedApps.length > 0 ? (
              <View
                style={{
                  flex: 1,
                  height: 250,
                  marginRight: layout.padding_x4,
                  paddingTop: layout.padding_x4,
                }}
              >
                {Object.values(selectedApps)
                  .sort(sortStrategy)
                  .map((option, index) => {
                    return (
                      <SelectedDraggable
                        option={option}
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
