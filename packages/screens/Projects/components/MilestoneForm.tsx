import { Formik } from "formik";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { number, object, string } from "yup";

import closeSVG from "../../../../assets/icons/close.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SimpleButton } from "../../../components/buttons/SimpleButton";
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
  neutralFF,
  primaryColor,
  redDefault,
} from "../../../utils/style/colors";
import { fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { ProjectMilestone, MsPriority, MsStatus } from "../types";

const PRIORITIES: SelectInputItem[] = [
  { label: "High", value: MsPriority.MS_PRIORITY_HIGH.toString() },
  { label: "Medium", value: MsPriority.MS_PRIORITY_MEDIUM.toString() },
];

const initialValues: ProjectMilestone = {
  id: 0,
  title: "",
  desc: "",
  priority: MsPriority.MS_PRIORITY_MEDIUM,
  status: MsStatus.MS_OPEN,
  amount: 0,
  link: "",
  paid: 0,
  funded: false,
  duration: 0,
};

const newMilestoneSchema = object({
  title: string()
    .required()
    .min(3)
    .matches(/^[^,]*$/, "Should not contain ,"),
  desc: string()
    .required()
    .min(10)
    .matches(/^[^,]*$/, "Should not contain ,"),
  amount: number().required().positive().integer(),
  priority: string(),
  link: string().url(),
  duration: number().min(1),
});

export const MilestoneForm: React.FC<{
  onSubmit: (milestone: ProjectMilestone) => void;
  onClose: () => void;
}> = ({ onSubmit, onClose }) => {
  const [priority, setPriority] = useState<MsPriority>(
    MsPriority.MS_PRIORITY_MEDIUM,
  );

  return (
    <View>
      <Formik
        initialValues={initialValues}
        validationSchema={newMilestoneSchema}
        onSubmit={(values: ProjectMilestone) => {
          values.priority = priority;
          onSubmit(values);
        }}
      >
        {({ handleChange, handleSubmit, values, errors }) => {
          return (
            <TertiaryBox
              style={{
                backgroundColor: neutral22,
                padding: layout.spacing_x2,
                marginBottom: layout.spacing_x2,
              }}
            >
              <TextInputCustom
                onChangeText={handleChange("title")}
                name="milestoneName"
                label=""
                placeHolder="⚡️ Type name here..."
                hideLabel
                fullWidth
                noBrokenCorners
                containerStyle={{ width: "100%" }}
                height={32}
                value={values.title}
                error={errors.title}
              />

              <SpacerColumn size={1.5} />

              <TextInputCustom
                label=""
                hideLabel
                name="desc"
                fullWidth
                multiline
                placeholder="Type description here..."
                textInputStyle={{ height: 40 }}
                noBrokenCorners
                onChangeText={handleChange("desc")}
                value={values.desc}
                error={errors.desc}
              />

              <SpacerColumn size={1.5} />

              <FlexRow style={{ zIndex: 2 }}>
                <BrandText
                  style={[fontSemibold12, { color: neutral77, flex: 1 }]}
                >
                  Priority
                </BrandText>
                <SelectInput
                  data={PRIORITIES}
                  selectedItem={
                    PRIORITIES.find((p) => p.value === priority.toString()) ||
                    PRIORITIES[0]
                  }
                  selectItem={(item) => setPriority(item.value as any)}
                  boxStyle={{ height: 32 }}
                />
              </FlexRow>

              <SpacerColumn size={1.5} />

              <FlexRow style={{ padding: 0 }}>
                <BrandText
                  style={[fontSemibold12, { color: neutral77, flex: 1 }]}
                >
                  Budget
                </BrandText>
                <TextInputCustom
                  onChangeText={handleChange("amount")}
                  name="milestoneBudget"
                  label=""
                  placeHolder="Type here..."
                  hideLabel
                  fullWidth
                  noBrokenCorners
                  containerStyle={{ flex: 1 }}
                  height={32}
                  value={"" + values.amount}
                  error={errors.amount}
                />
              </FlexRow>

              <SpacerColumn size={1.5} />

              <FlexRow style={{ padding: 0 }}>
                <BrandText
                  style={[fontSemibold12, { color: neutral77, flex: 1 }]}
                >
                  Duration
                </BrandText>
                <TextInputCustom
                  onChangeText={handleChange("duration")}
                  name="milestoneDuration"
                  label=""
                  placeHolder="Type here..."
                  hideLabel
                  fullWidth
                  noBrokenCorners
                  containerStyle={{ flex: 1 }}
                  height={32}
                  value={"" + values.duration}
                  error={errors.duration}
                />
              </FlexRow>

              <SpacerColumn size={1.5} />

              <FlexRow>
                <BrandText
                  style={[fontSemibold12, { color: neutral77, flex: 1 }]}
                >
                  Github link
                </BrandText>
                <TextInputCustom
                  onChangeText={handleChange("link")}
                  name="milestoneGithubLink"
                  label=""
                  placeHolder="Github link..."
                  hideLabel
                  fullWidth
                  noBrokenCorners
                  containerStyle={{ flex: 1 }}
                  height={32}
                  value={values.link}
                  error={errors.link}
                />
              </FlexRow>

              <SpacerColumn size={2} />

              <SimpleButton
                onPress={handleSubmit}
                text="Confirm"
                size="XS"
                color={neutralFF}
                bgColor={primaryColor}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </TertiaryBox>
          );
        }}
      </Formik>

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
