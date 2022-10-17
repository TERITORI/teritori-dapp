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

import { ModalValidation } from "./ModalValidation";
import { ModalError } from "./ModalError";
import { ChallengeValidation } from "./ChallengeValidation";

import { DetailsCard } from "./DetailsCard";

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

const Separator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
    <View
      style={[
        { borderBottomWidth: 1, borderColor: neutral44, width: "100%" },
        style,
      ]}
    />
);

export const ChallengeDetails: React.FC < {
    visible?: boolean;
    onClose: () => void;
    title: string;
    description: string;
    tags: string[];
  }> = ({ visible, onClose, title,
    description,
    tags, }) => {
    const [displayChallengedDetails, setdisplayChallengedDetails] = useState(visible);
    const [displayStateValidation, setdisplayStateValidation] = useState(false);
    const [displayStateValidationError, setdisplayStateValidationError] = useState(false);
    const [displayPassedChallengeScreen, setdisplayPassedChallengeScreen] = useState(false);

    function handleConfirmClick() {
        onClose();
        console.log(displayChallengedDetails)
        setdisplayChallengedDetails(false);
    }

    function displayChallengeValidation() {
        if (displayPassedChallengeScreen == true) {
            return (
                <ChallengeValidation visible={true} onClose={() => {
                    setdisplayPassedChallengeScreen(false)
                    handleConfirmClick()
                }}/>
            )
        }
        else
            return ""
    }

    function ValidationModal() {
        if (displayStateValidation == true) {
            return (
                <ModalValidation visible={true} onClose={() => {
                    setdisplayStateValidation(false)
                    setdisplayPassedChallengeScreen(true)
                }}/>
            )
        }
        else
            return ""
    }

    function ErrorModal() {
        if (displayStateValidationError == true) {
            return (
                <ModalError visible={true} onClose={() => {
                    setdisplayStateValidationError(false)
                }}/>
            )
        }
        else
            return ""
    }

    return (
        <>
        <ModalBase
            onClose={() => {handleConfirmClick()
                console.log(displayChallengedDetails)}}
            label="Challenge"
            visible={displayChallengedDetails}
            width={675}
            hideMainSeparator={true}
            >

            <DetailsCard title={title} description={description} tags={tags}/>

            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                <BrandText style={{fontSize: 16}}>
                Solve Challenge
                </BrandText>
                <View style={{backgroundColor: "#171717", width: "fit-content", borderRadius: 6, alignItems: "center", justifyContent: "center"}}>
                    <BrandText style={{fontSize: 12, color: "#777777"}}>
                    {"  purchased Today at 5:54 PM  "}
                    </BrandText>
                </View>
            </View>
            <View style={{backgroundColor: "#171717", borderWidth: 1, borderColor: "#333333", height:72,  borderRadius: 8, alignItems: "flex-start", justifyContent: "center", marginBottom: 20}}>
                <View style={{display: "flex", flexDirection: "column", justifyContent: "space-around", marginLeft: 10}}>
                    <View style={{flexDirection: "row"}}>
                        <BrandText style={{fontSize: 13, marginBottom: 5}}>
                        {"http://iadu7qp6.fr2.pathwar.net  "}
                        </BrandText>
                        <AiOutlineCheck color="#C8FFAE" style={{marginLeft: 8}}/>
                        <BrandText style={{fontSize: 13, marginBottom: 5, color: "#C8FFAE", marginLeft: 5}}>
                        {"Available  "}
                        </BrandText>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <BrandText style={{fontSize: 13, marginBottom: 5}}>
                        {"http://12rchdcf.local  "}
                        </BrandText>
                        <IoMdClose color="#EAA54B" style={{marginLeft: 8}}/>
                        <BrandText style={{fontSize: 13, marginBottom: 5, color: "#EAA54B", marginLeft: 5}}>
                        {"Available soon...  "}
                        </BrandText>
                    </View>
                </View>
            </View>

            <SecondaryButton
                size="SM"
                text="Validate"
                width={128}
                style={{marginBottom: 15}}/>
            
            <TertiaryBox width={635} height={236} mainContainerStyle={{backgroundColor: "#171717"}} style={{marginBottom: 20}}>
                <View style={{flexDirection: "column", justifyContent: "space-between", bottom: 5}}>
                    <View style={{marginBottom: 15}}>
                        <BrandText style={{fontSize: 14, color: "#777777", marginBottom: 5}}>
                            {"Passphrase"}
                        </BrandText>
                        <TextInputCustom
                            label=""
                            name={"Passphrase"}
                            placeHolder="Passphrases separated by ','"
                            width={600}
                            squaresBackgroundColor="#171717">
                        </TextInputCustom>
                    </View>
                    <View style={{marginBottom: 15}}>
                        <BrandText style={{fontSize: 14, color: "#777777", marginBottom: 5}}>
                            {"Comment"}
                        </BrandText>
                        <TextInputCustom
                            label=""
                            name={"Comment"}
                            placeHolder="Leave a comment..."
                            width={600}
                            squaresBackgroundColor="#171717">
                        </TextInputCustom>
                    </View>

                    <PrimaryButton
                        size='SM'
                        text='Send'
                        width={100}
                        squaresBackgroundColor="#171717"
                        onPress={() => {setdisplayPassedChallengeScreen(true)}}/>
                </View>
            </TertiaryBox>
        </ModalBase>

        {displayChallengeValidation()}
        {ValidationModal()}
        {ErrorModal()}

        </>
    )
}
