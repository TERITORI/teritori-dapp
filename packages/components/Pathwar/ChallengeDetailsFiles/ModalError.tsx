import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, StyleProp, ViewStyle, StyleSheet } from 'react-native';

import ModalBase from "../../modals/ModalBase";
import { BrandText } from "../../BrandText/BrandText";
import { neutral44 } from "../../../utils/style/colors";
import { AiOutlineCheck, AiFillStar } from 'react-icons/ai';
import { HiClock } from 'react-icons/hi';
import { BsFillDiamondFill } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/Io';
import { RiErrorWarningLine } from 'react-icons/Ri';
import TerritoriLogo from "../../../assets/TerritoriLogo.png";
import { ProgressBar } from 'react-native-paper';

import { TertiaryBox } from "../../boxes/TertiaryBox";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { TextInputCustom } from "../../inputs/TextInputCustom";

const useProgress = (maxTimeInSeconds = 60) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [progress, setProgress] = useState(0);
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        if (progress < 1) {
          setElapsedTime(t => t + 1);
        }
      }, 10);
  
      return () => clearInterval(intervalId);
    }, []);
  
    useEffect(() => {
      setProgress(elapsedTime / maxTimeInSeconds);
    }, [elapsedTime]);

    return progress;
};

export const ModalError: React.FC < {
    visible?: boolean;
    onClose: () => void;
  }> = ({ visible, onClose }) => {
    const [displayStateValidationError, setdisplayStateValidationError] = useState(visible);
    const progress = useProgress();

    function handleConfirmClick() {
        onClose();
        console.log(displayStateValidationError)
        setdisplayStateValidationError(false);
    }

    return (
        <ModalBase
            visible={displayStateValidationError}
            width={350}
            hideMainSeparator={true}
            displayHeader={false}
            >
                <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", margin: 20}}>
                    <View style={{flexDirection: "row", right: 50, justifyContent: "center", alignItems: "center"}}>
                        <RiErrorWarningLine color="#F46F76" />
                        <BrandText style={{fontSize: 16, marginLeft: 10}}>
                        Validate Challenge Error!
                        </BrandText>
                    </View>
                    <TouchableOpacity onPress={() => {
                        handleConfirmClick()
                        // setdisplayPassedChallengeScreen(true)
                        }} style={{left: 40}}>
                        <IoMdClose color="white"/>
                    </TouchableOpacity>
                </View>
                <View style={{width: 340, right: 19, borderRadius: 1}}>
                    <ProgressBar progress={progress} color="#F46F76" style={{borderBottomLeftRadius: 30}}/>
                </View>
        </ModalBase>
    )
}
