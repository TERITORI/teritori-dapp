import React, { useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Hoverable from "react-native-hoverable";
import { SvgProps } from "react-native-svg";

import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";
import { TaskList } from "./TaskList";
import { Task } from "./types";
import addCircleSVG from "../../../../assets/icons/add-circle.svg";
import grantsCompletedSVG from "../../../../assets/icons/grants-completed.svg";
import grantsInProgressSVG from "../../../../assets/icons/grants-inProgress.svg";
import grantsOpenSVG from "../../../../assets/icons/grants-open.svg";
import grantsReviewSVG from "../../../../assets/icons/grants-review.svg";
import noTasksSVG from "../../../../assets/icons/no-tasks.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { SimpleButton } from "../../../components/buttons/SimpleButton";
import { SpacerRow } from "../../../components/spacer";
import {
  neutral00,
  neutral33,
  neutral77,
  neutralFF,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

type Status = {
  id: string;
  text: string;
  iconSVG: React.FC<SvgProps>;
  count: number;
};

const STATUSES: Status[] = [
  { id: "open", text: "Open (Backlog)", count: 4, iconSVG: grantsOpenSVG },
  {
    id: "inProgress",
    text: "In Progress",
    count: 4,
    iconSVG: grantsInProgressSVG,
  },
  { id: "review", text: "Review", count: 4, iconSVG: grantsReviewSVG },
  { id: "completed", text: "Completed", count: 4, iconSVG: grantsCompletedSVG },
];

const TASKS: Task[] = [
  {
    id: 1,
    text: "Community Docs Platform 1",
    statusId: "open",
    priority: "hight",
    budget: 10,
    github: "https://github.com",
  },
  {
    id: 3,
    text: "Community Docs Platform 3",
    statusId: "review",
    priority: "medium",
    budget: 10,
    github: "https://github.com",
  },
  {
    id: 4,
    text: "Community Docs Platform 4",
    statusId: "review",
    priority: "hight",
    budget: 10,
    github: "https://github.com",
  },
  {
    id: 5,
    text: "Community Docs Platform 5",
    statusId: "completed",
    priority: "medium",
    budget: 10,
    github: "https://github.com",
  },
  {
    id: 6,
    text: "Community Docs Platform 6",
    statusId: "open",
    priority: "hight",
    budget: 10,
    github: "https://github.com",
  },
  {
    id: 7,
    text: "Community Docs Platform 7",
    statusId: "review",
    priority: "medium",
    budget: 10,
    github: "https://github.com",
  },
];

export const TaskBoard: React.FC<{
  containerStyle?: StyleProp<ViewStyle>;
  selectTask?: (taskId: number) => void;
  editable?: boolean;
}> = ({ selectTask, containerStyle, editable }) => {
  const [hoveredTask, setHoveredTask] = useState<Task>();
  const [newTaskVisible, setNewTaskVisible] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [newTask, setNewTask] = useState<Task>();

  const addTask = (task: Task) => {
    setNewTaskVisible(false);
    setTasks([...tasks, task]);
  };

  return (
    <FlexRow
      style={[
        {
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
        },
        containerStyle,
      ]}
    >
      {STATUSES.map((step, idx) => {
        const listItems = tasks.filter((task) => task.statusId === step.id);
        const isBacklogItem = idx === 0;

        return (
          <TaskList text={step.text} count={step.count} iconSVG={step.iconSVG}>
            {listItems.map((task) => {
              const isHovered = hoveredTask?.id === task.id;
              return (
                <Hoverable
                  onMouseEnter={() =>
                    isBacklogItem && editable && setHoveredTask(task)
                  }
                  onMouseLeave={() =>
                    isBacklogItem && editable && setHoveredTask(undefined)
                  }
                >
                  <TaskItem
                    onPress={() => selectTask?.(task.id)}
                    text={task.text}
                    priority={task.priority}
                    showDelete={isHovered}
                    containerStyle={[
                      isHovered && {
                        backgroundColor: neutral33,
                      },
                    ]}
                  />
                  <SpacerRow size={3} />
                </Hoverable>
              );
            })}

            {listItems.length === 0 && (
              <FlexRow
                style={{
                  backgroundColor: neutral00,
                  borderRadius: 8,
                  padding: layout.spacing_x1_5,
                }}
              >
                <SVG source={noTasksSVG} width={18} height={18} />
                <SpacerRow size={1} />
                <BrandText style={[fontSemibold13, { color: neutral77 }]}>
                  {editable ? "No tasks" : "Empty"}
                </BrandText>
              </FlexRow>
            )}

            {isBacklogItem && newTaskVisible && (
              <TaskForm
                onChange={setNewTask}
                onClose={() => setNewTaskVisible(false)}
              />
            )}

            {isBacklogItem && editable && !newTaskVisible && (
              <SimpleButton
                onPress={() => setNewTaskVisible(true)}
                text="Add"
                size="XS"
                iconSVG={addCircleSVG}
                color={neutralFF}
                bgColor={neutral33}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: layout.spacing_x2,
                }}
              />
            )}

            {isBacklogItem && editable && newTaskVisible && (
              <SimpleButton
                onPress={() => newTask && addTask(newTask)}
                text="Confirm"
                size="XS"
                color={neutralFF}
                bgColor={primaryColor}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: layout.spacing_x2,
                }}
              />
            )}
          </TaskList>
        );
      })}
    </FlexRow>
  );
};
