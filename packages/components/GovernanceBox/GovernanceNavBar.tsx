import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
  View,
} from "react-native";

import { BrandText } from "../../components/BrandText/BrandText";



export const GovernanceNavBar: React.FC<{
    onPress?: (() => Promise<void>) | (() => void);
    }> = ({
    onPress,
    }) => {
    const [colorAllperiod, setcolorAllperiod] = useState("white");
    const [colorPending, setcolorPending] = useState("grey");
    const [colorVoting, setcolorVoting] = useState("grey");
    const [colorPassed, setcolorPassed] = useState("grey");
    const [colorRejected, setcolorRejected] = useState("grey");
    const [colorFailed, setcolorFailed] = useState("grey");


    function handleAllPeriodClick() {
        setcolorAllperiod("white");
        setcolorPending("grey");
        setcolorPassed("grey");
        setcolorRejected("grey");
        setcolorFailed("grey");
        setcolorVoting("grey");
    }
    function handleVotingClick() {
        setcolorVoting("white");
        setcolorAllperiod("grey");
        setcolorPending("grey");
        setcolorPassed("grey");
        setcolorRejected("grey");
        setcolorFailed("grey");
    }

    function handlePendingClick() {
        setcolorPending("white");
        setcolorAllperiod("grey");
        setcolorPassed("grey");
        setcolorRejected("grey");
        setcolorFailed("grey");
        setcolorVoting("grey");
    }

    function handlePassedClick() {
        setcolorPassed("white");
        setcolorAllperiod("grey");
        setcolorRejected("grey");
        setcolorFailed("grey");
        setcolorPending("grey");
        setcolorVoting("grey");
    }

    function handleRejectedClick() {
        setcolorRejected("white");
        setcolorAllperiod("grey");
        setcolorFailed("grey");
        setcolorPending("grey");
        setcolorPassed("grey");
        setcolorVoting("grey");
    }

    function handleFailedClick() {
        setcolorFailed("white");
        setcolorAllperiod("grey");
        setcolorPending("grey");
        setcolorPassed("grey");
        setcolorRejected("grey");
        setcolorVoting("grey");
    }

    // function 

    const [isLoading, setIsLoading] = useState(false);

    const handlePress = useCallback(async () => {
        if (isLoading || !onPress) {
        return;
        }
        setIsLoading(true);
        try {
        await onPress();
        } catch (err) {
        console.error(err);
        }
        setIsLoading(false);
    }, [onPress, isLoading]);

  return (
    <TouchableOpacity
      onPress={onPress ? handlePress : undefined}
    >
        <View style={{
        display: "flex",
        flexWrap: "wrap",
        alignContent: "center",
        justifyContent: "center",
        height: 10,
        position: "absolute",
        left: 900,
        top: 65,
      }}>
        <a onClick={handleAllPeriodClick} style={{cursor: "pointer", margin: 10}}>
          <BrandText style={{
              fontSize: 14,
              color: colorAllperiod,
          }}
          >
            All period
          </BrandText>

          <View style={{
              width: 8,
              height: 8,
              backgroundColor: colorAllperiod,
              borderRadius: 4,
              position: "relative",
                left: "50%",
                top: 10,
            }}/>
        </a>

        <a onClick={handlePendingClick} style={{cursor: "pointer", margin: 10,}}>
          <BrandText style={{
              fontSize: 14,
              color: colorPending,
          }}
          >
            Pending
          </BrandText>

          <View style={{
              width: 8,
              height: 8,
              backgroundColor: colorPending,
              borderRadius: 4,
              position: "relative",
                left: "50%",
                top: 10,
            }}/>
        </a>

        <a onClick={handleVotingClick} style={{cursor: "pointer", margin: 10,}}>
          <BrandText style={{
              fontSize: 14,
              color: colorVoting,
          }}
          >
            Voting
          </BrandText>

          <View style={{
              width: 8,
              height: 8,
              backgroundColor: colorVoting,
              borderRadius: 4,
              position: "relative",
                left: "50%",
                top: 10,
            }}/>
        </a>

        <a onClick={handlePassedClick} style={{cursor: "pointer", margin: 10,}}>
          <BrandText style={{
              fontSize: 14,
              color: colorPassed,
          }}
          >
            Passed
          </BrandText>

          <View style={{
              width: 8,
              height: 8,
              backgroundColor: colorPassed,
              borderRadius: 4,
              position: "relative",
                left: "50%",
                top: 10,
            }}/>
        </a>

        <a onClick={handleRejectedClick} style={{cursor: "pointer", margin: 10,}}>
          <BrandText style={{
              fontSize: 14,
              color: colorRejected,
          }}
          >
            Rejected
          </BrandText>

          <View style={{
              width: 8,
              height: 8,
              backgroundColor: colorRejected,
              borderRadius: 4,
              position: "relative",
                left: "50%",
                top: 10,
            }}/>
        </a>

        <a onClick={handleFailedClick} style={{cursor: "pointer", margin: 10,}}>
          <BrandText style={{
              fontSize: 14,
              color: colorFailed,
          }}
          >
            Failed
          </BrandText>

          <View style={{
              width: 8,
              height: 8,
              backgroundColor: colorFailed,
              borderRadius: 4,
              position: "relative",
                left: "50%",
                top: 10,
            }}/>
        </a>
        </View>
      
    </TouchableOpacity>
  );
};
