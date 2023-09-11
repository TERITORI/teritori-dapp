import React from "react";
import { View } from "react-native";

import { neutral17 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { TaskBoard } from "../components/TaskBoard";

export const Milestones: React.FC = () => {
  return (
    <View>
      <TaskBoard
        editable
        containerStyle={{
          backgroundColor: neutral17,
          padding: layout.spacing_x2,
          borderRadius: 8,
        }}
      />
    </View>
  );
};
