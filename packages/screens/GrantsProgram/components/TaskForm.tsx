import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { Task } from "./types";
import closeSVG from "../../../../assets/icons/close.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import {
  SelectInput,
  SelectInputItem,
} from "../../../components/inputs/SelectInput";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
import {
  neutral22,
  neutral33,
  neutral44,
  neutral77,
  redDefault,
} from "../../../utils/style/colors";
import { fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

const PRIORITIES: SelectInputItem[] = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
];

export const TaskForm: React.FC<{
  onChange?: (task: Task) => void;
  onClose?: () => void;
}> = ({ onChange, onClose }) => {
  const [task, setTask] = useState<Task>({
    id: 10,
    text: "",
    priority: "hight",
    statusId: "open",
    budget: 10,
    github: "https://github.com",
  });

  const updateTask = (field: keyof Task, value: string) => {
    const newData = { ...task, [field]: value };
    setTask(newData);
    onChange?.(newData);
  };

  return (
    <View>
      <TertiaryBox
        fullWidth
        noBrokenCorners
        mainContainerStyle={{
          backgroundColor: neutral22,
          padding: layout.spacing_x2,
          marginBottom: layout.spacing_x2,
        }}
      >
        <TextInputCustom
          onChangeText={(text) => updateTask("text", text)}
          name="taskName"
          label=""
          placeHolder="⚡️ Type name here..."
          hideLabel
          fullWidth
          noBrokenCorners
          height={32}
          containerStyle={{ width: "100%" }}
        />

        <SpacerColumn size={1.5} />

        <FlexRow>
          <BrandText style={[fontSemibold12, { color: neutral77, flex: 1 }]}>
            Priority
          </BrandText>
          <SelectInput
            data={[
              { label: "Hight", value: "hight" },
              { label: "Medium", value: "medium" },
            ]}
            selectedItem={PRIORITIES[0]}
            selectItem={(item) => updateTask("priority", item.value)}
            style={{ flex: 1 }}
            boxStyle={{ height: 32 }}
          />
        </FlexRow>

        <SpacerColumn size={1.5} />

        <FlexRow style={{ padding: 0 }}>
          <BrandText style={[fontSemibold12, { color: neutral77, flex: 1 }]}>
            Budget
          </BrandText>
          <TextInputCustom
            onChangeText={(text) => updateTask("budget", text)}
            name="taskBudget"
            label=""
            placeHolder="Type here..."
            hideLabel
            fullWidth
            noBrokenCorners
            containerStyle={{ flex: 1 }}
            height={32}
          />
        </FlexRow>

        <SpacerColumn size={1.5} />

        <FlexRow>
          <BrandText style={[fontSemibold12, { color: neutral77, flex: 1 }]}>
            Github link
          </BrandText>
          <TextInputCustom
            onChangeText={(text) => updateTask("github", text)}
            name="taskGithubLink"
            label=""
            placeHolder="Github link..."
            hideLabel
            fullWidth
            noBrokenCorners
            containerStyle={{ flex: 1 }}
            height={32}
          />
        </FlexRow>
      </TertiaryBox>

      <TouchableOpacity
        onPress={() => onClose?.()}
        style={{
          position: "absolute",
          right: -44,
          top: "30%",
          padding: layout.spacing_x1,
          backgroundColor: neutral33,
          borderWidth: 1,
          borderColor: neutral44,
          borderRadius: 100,
        }}
      >
        <SVG source={closeSVG} width={16} height={16} color={redDefault} />
      </TouchableOpacity>
    </View>
  );
};
