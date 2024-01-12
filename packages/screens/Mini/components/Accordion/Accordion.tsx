import { FC, PropsWithChildren, useLayoutEffect, useRef } from "react";
import { Animated, View } from "react-native";

import AccordionProvider, { useAccordion } from "./AccordionProvider";
import chevronSVG from "../../../../../assets/icons/chevron-down-gray.svg";
import { SVG } from "../../../../components/SVG";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";

interface IAccordionComposition {
  Header: React.FC<PropsWithChildren<{ enableIcon?: boolean }>>;
  Content: React.FC<PropsWithChildren<{ height?: number }>>;
}

const Accordion: FC<PropsWithChildren<{ initialValue?: boolean }>> &
  IAccordionComposition = ({ children, initialValue = false }) => {
  return (
    <AccordionProvider initialValue={initialValue}>
      {children}
    </AccordionProvider>
  );
};

export function AccordionHeader({
  children,
  enableIcon = true,
}: PropsWithChildren<{ enableIcon?: boolean }>) {
  const { expanded, toggle } = useAccordion();
  const rotationValue = useRef(new Animated.Value(1)).current;

  useLayoutEffect(() => {
    if (expanded) {
      Animated.timing(rotationValue, {
        duration: 300,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(rotationValue, {
        duration: 300,
        toValue: 1,
        useNativeDriver: false,
      }).start();
    }
  }, [expanded, rotationValue]);

  return (
    <CustomPressable onPress={toggle} style={{ opacity: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>{children}</View>
        {enableIcon && (
          <Animated.View
            style={{
              transform: [
                {
                  rotate: rotationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["180deg", "0deg"],
                  }),
                },
              ],
            }}
          >
            <SVG source={chevronSVG} height={24} width={24} />
          </Animated.View>
        )}
      </View>
    </CustomPressable>
  );
}

export function AccordionContent({
  children,
  height = 200,
}: PropsWithChildren<{ height?: number }>) {
  const { expanded } = useAccordion();
  const animation = useRef(new Animated.Value(0)).current;

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height],
  });

  useLayoutEffect(() => {
    if (expanded) {
      Animated.timing(animation, {
        duration: 300,
        toValue: 1,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animation, {
        duration: 300,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  }, [expanded, animation]);

  return (
    <Animated.View style={{ height: heightInterpolate }}>
      {children}
    </Animated.View>
  );
}

Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;

export default Accordion;
