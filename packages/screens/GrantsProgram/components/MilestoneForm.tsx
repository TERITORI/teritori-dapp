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
import {
  PRIORITY_HIGH,
  PRIORITY_MEDIUM,
  STATUS_OPEN,
  Milestone,
} from "../types";

const PRIORITIES: SelectInputItem[] = [
  { label: "High", value: PRIORITY_HIGH },
  { label: "Medium", value: PRIORITY_MEDIUM },
];

const initialValues: Milestone = {
  id: 0,
  name: "",
  desc: "",
  priority: PRIORITY_HIGH,
  statusId: STATUS_OPEN,
  budget: 0,
  githubLink: "",
};

const newMilestoneSchema = object({
  name: string().required().min(3),
  desc: string().required().min(10),
  budget: number().required().positive().integer(),
  priotity: string(),
  github: string().url(),
});

export const MilestoneForm: React.FC<{
  onSubmit: (milestone: Milestone) => void;
  onClose: () => void;
}> = ({ onSubmit, onClose }) => {
  const [priority, setPriority] = useState<"high" | "medium">(PRIORITY_HIGH);

  return (
    <View>
      <Formik
        initialValues={initialValues}
        validationSchema={newMilestoneSchema}
        onSubmit={(values: Milestone) => {
          values.priority = priority;
          onSubmit(values);
        }}
      >
        {({ handleChange, handleSubmit, values, errors }) => (
          <TertiaryBox
            style={{
              backgroundColor: neutral22,
              padding: layout.spacing_x2,
              marginBottom: layout.spacing_x2,
            }}
          >
            <TextInputCustom
              onChangeText={handleChange("name")}
              name="milestoneName"
              label=""
              placeHolder="⚡️ Type name here..."
              hideLabel
              fullWidth
              noBrokenCorners
              containerStyle={{ width: "100%" }}
              height={32}
              value={values.name}
              error={errors.name}
            />

            <SpacerColumn size={1.5} />

            <TextInputCustom
              label=""
              hideLabel
              name="description"
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
                data={[
                  { label: "Hight", value: PRIORITY_HIGH },
                  { label: "Medium", value: PRIORITY_MEDIUM },
                ]}
                selectedItem={
                  PRIORITIES.find((p) => p.value === priority) || PRIORITIES[0]
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
                onChangeText={handleChange("budget")}
                name="milestoneBudget"
                label=""
                placeHolder="Type here..."
                hideLabel
                fullWidth
                noBrokenCorners
                containerStyle={{ flex: 1 }}
                height={32}
                value={"" + values.budget}
                error={errors.budget}
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
                onChangeText={handleChange("github")}
                name="milestoneGithubLink"
                label=""
                placeHolder="Github link..."
                hideLabel
                fullWidth
                noBrokenCorners
                containerStyle={{ flex: 1 }}
                height={32}
                value={values.githubLink}
                error={errors.githubLink}
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
        )}
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
