import React from "react";
import { FlatList, View } from "react-native";

import dotSVG from "../../../../../assets/icons/dots.svg";
import { SVGorImageIcon } from "../../../../components/SVG/SVGorImageIcon";
import { SpacerColumn, SpacerRow } from "../../../../components/spacer";
import { primaryColor, withAlpha } from "../../../../utils/style/colors";
import { fontSemibold14 } from "../../../../utils/style/fonts";
import GradientBox from "../../Notifications/components/GradientBox";
import { randomGradients } from "../../Notifications/notificationData";
import Accordion from "../../components/Accordion/Accordion";
import { DropdownWithListItem } from "../../components/Dropdown/DropdownWithListItem";
import ListView from "../../components/ListView";

type NFTProps = {
  id: string;
  name?: string;
  img?: string;
};

type NFTCardProps = {
  data: NFTProps;
};

type CollectionType = {
  id: string;
  title: string;
  cards: NFTProps[];
};

export default function NFTAccordion({
  open = false,
  item,
}: {
  open?: boolean;
  item: CollectionType;
}) {
  return (
    <Accordion initialValue={open}>
      <Accordion.Header
        iconSize={16}
        children={
          <AccordionTrigger
            label={item.title}
            subLabel={item.cards.length.toString()}
          />
        }
      />
      <Accordion.Content
        height={190}
        children={<AccordionContent options={item.cards} />}
      />
    </Accordion>
  );
}

function AccordionTrigger({
  label,
  subLabel,
}: {
  label: string;
  subLabel: string;
}) {
  const randomIndex = Math.floor(Math.random() * 4);
  return (
    <ListView
      style={{ paddingVertical: 0 }}
      options={{
        leftIconEnabled: true,
        leftLabel: label,
        leftLabelStyle: [fontSemibold14, { color: "#fff", marginLeft: 6 }],
        rightLabel: subLabel,
        rightLabelStyle: [fontSemibold14, { marginRight: 6 }],
        leftIconOptions: {
          component: (
            <GradientBox
              size={40}
              colors={randomGradients[randomIndex].colors}
              direction={randomGradients[randomIndex].direction}
              radius={10}
            />
          ),
        },
        iconEnabled: false,
      }}
    />
  );
}

function AccordionContent({ options }: { options: NFTProps[] }) {
  return (
    <>
      <SpacerColumn size={1.5} />
      <FlatList
        style={{ height: 174, flexGrow: 0 }}
        ItemSeparatorComponent={() => <SpacerRow size={1.5} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={options}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NFTCard key={item.id} data={item} />}
      />
    </>
  );
}

function NFTCard({ data }: NFTCardProps) {
  const randomIndex = Math.floor(Math.random() * 4);

  return (
    <View
      style={{
        height: 174,
        width: 174,
        borderRadius: 14,
        backgroundColor: primaryColor,
        position: "relative",
      }}
    >
      <View
        style={{
          backgroundColor: withAlpha("#ffffff", 0.1),
          position: "absolute",
          right: 4,
          top: 4,
          width: 24,
          height: 24,
          borderRadius: 12,
          zIndex: 999,
        }}
      >
        <DropdownWithListItem
          items={[{ name: "collection 1" }, { name: "collection 2" }]}
          icon={dotSVG}
          positionStyle={{ top: 30 }}
          style={{ width: 120 }}
        />
      </View>
      {data.img ? (
        <SVGorImageIcon
          icon={data.img}
          iconSize={174}
          style={{ borderRadius: 14 }}
        />
      ) : (
        <GradientBox
          colors={randomGradients[randomIndex].colors}
          direction={randomGradients[randomIndex].direction}
          size={174}
          radius={14}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
}
