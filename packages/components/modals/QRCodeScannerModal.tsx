import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";

import ModalBase from "./ModalBase";
import { useFeedbacks } from "../../context/FeedbacksProvider";

export const QRCodeScannerModal = ({ onClose }) => {
  const { setToastError } = useFeedbacks();
  const { width, height } = useWindowDimensions();
  const [permission, setPermission] = useState(false);
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const status = await BarCodeScanner.requestPermissionsAsync();

      if (status.granted) {
        setPermission(true);
      }
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
        {permission ? (
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        ) : (
          <ActivityIndicator size="large" color="white" />
        )}
      </View>
    </ModalBase>
  );
};
