import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useEffect } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";

import ModalBase from "./ModalBase";
import { useFeedbacks } from "../../context/FeedbacksProvider";

export const QRCodeScannerModal = ({ onClose }) => {
  const { setToastError } = useFeedbacks();
  const { width, height } = useWindowDimensions();
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      await BarCodeScanner.requestPermissionsAsync();
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    if (
      typeof data === "string" &&
      data.startsWith("https://app.teritori.com/contact")
    ) {
      onClose(data);
    } else {
      setToastError({
        title: "QR Error",
        message: "QR is not of Teritori contact",
      });
    }
  };
  return (
    <ModalBase label="Scan QR" onClose={onClose} visible width={width}>
      <View
        style={{
          height: height - 180,
          width: "100%",
        }}
      >
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    </ModalBase>
  );
};
