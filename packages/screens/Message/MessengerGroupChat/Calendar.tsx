import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

const Calendars = () => {
  const [selected, setSelected] = useState("");

  return (
    <Calendar
      onDayPress={(day) => {
        setSelected(day.dateString);
      }}
      markedDates={{
        [selected]: {
          selected: true,
          disableTouchEvent: true,
          selectedDotColor: "orange",
        },
      }}
    />
  );
};
export default Calendars;
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
});
