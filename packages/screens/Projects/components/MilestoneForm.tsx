import { Decimal } from "@cosmjs/math";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

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
  MilestoneFormValues,
  MilestonePriority,
  zodMilestoneFormValues,
} from "../types";

import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import {
  NetworkFeature,
  getNativeCurrency,
  getNetworkFeature,
} from "@/networks";

const PRIORITIES: SelectInputItem[] = [
  { label: "High", value: "MS_PRIORITY_HIGH".toString() },
  { label: "Medium", value: "MS_PRIORITY_MEDIUM".toString() },
];

const initialValues: MilestoneFormValues = {
  title: "",
  desc: "",
  priority: "MS_PRIORITY_MEDIUM",
  amount: 0,
  duration: 0,
};

export const MilestoneForm: React.FC<{
  onSubmit: (milestone: MilestoneFormValues) => void;
  onClose: () => void;
}> = ({ onSubmit, onClose }) => {
  const [priority, setPriority] =
    useState<MilestonePriority>("MS_PRIORITY_MEDIUM");

  const networkId = useSelectedNetworkId();

  const pmFeature = getNetworkFeature(
    networkId,
    NetworkFeature.GnoProjectManager,
  );
  const currency = getNativeCurrency(networkId, pmFeature?.paymentsDenom);
  const decimals = currency?.decimals || 0;

  const { handleSubmit, watch, formState, setValue } = useForm({
    resolver: zodResolver(zodMilestoneFormValues),
    defaultValues: initialValues,
  });
  const values = watch();
  const { errors } = formState;

  return (
    <View>
      <TertiaryBox
        style={{
          backgroundColor: neutral22,
          padding: layout.spacing_x2,
          marginBottom: layout.spacing_x2,
        }}
      >
        <TextInputCustom
          onChangeText={(val) => setValue("title", val)}
          name="milestoneName"
          label=""
          placeHolder="⚡️ Type name here..."
          hideLabel
          fullWidth
          noBrokenCorners
          containerStyle={{ width: "100%" }}
          height={32}
          value={values.title}
          error={errors.title?.message}
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
          onChangeText={(val) => setValue("desc", val)}
          value={values.desc}
          error={errors.desc?.message}
        />

        <SpacerColumn size={1.5} />

        <FlexRow style={{ zIndex: 2 }}>
          <BrandText style={[fontSemibold12, { color: neutral77, flex: 1 }]}>
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
          <BrandText style={[fontSemibold12, { color: neutral77, flex: 1 }]}>
            Budget
          </BrandText>
          <TextInputCustom
            onChangeText={(val) => setValue("amount", +val)}
            name="milestoneBudget"
            label=""
            placeHolder="Type here..."
            hideLabel
            fullWidth
            noBrokenCorners
            containerStyle={{ flex: 1 }}
            height={32}
            value={"" + values.amount}
            error={errors.amount?.message}
            testID="milestone-budget"
          />
        </FlexRow>

        <SpacerColumn size={1.5} />

        <FlexRow style={{ padding: 0 }}>
          <BrandText style={[fontSemibold12, { color: neutral77, flex: 1 }]}>
            Duration
          </BrandText>
          <TextInputCustom
            onChangeText={(val) => setValue("duration", +val)}
            name="milestoneDuration"
            label=""
            placeHolder="Type here..."
            hideLabel
            fullWidth
            noBrokenCorners
            containerStyle={{ flex: 1 }}
            height={32}
            value={"" + values.duration}
            error={errors.duration?.message}
            testID="milestone-duration"
          />
        </FlexRow>

        <SpacerColumn size={1.5} />

        <FlexRow>
          <BrandText style={[fontSemibold12, { color: neutral77, flex: 1 }]}>
            Github link
          </BrandText>
          <TextInputCustom
            onChangeText={(val) => setValue("link", val)}
            name="milestoneGithubLink"
            label=""
            placeHolder="Github link..."
            hideLabel
            fullWidth
            noBrokenCorners
            containerStyle={{ flex: 1 }}
            height={32}
            value={values.link}
            error={errors.link?.message}
          />
        </FlexRow>

        <SpacerColumn size={2} />

        <SimpleButton
          onPress={handleSubmit(
            (values) => {
              console.log("adding milestone: handle sumbit", values);
              values.priority = priority;
              // FIXME: loss of precision
              values.amount = +Decimal.fromUserInput(
                values.amount.toString(),
                decimals,
              ).atomics;
              onSubmit(values);
            },
            (state) => {
              console.error("adding milestone: invalid", state);
            },
          )}
          text="Confirm"
          size="XS"
          color={neutralFF}
          bgColor={primaryColor}
          testID="milestone-confirm"
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
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
