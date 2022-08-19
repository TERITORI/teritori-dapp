import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { useTNS } from "../../context/TNSProvider";
import { neutral33, neutral77 } from "../../utils/style/colors";
import { Metadata } from "../../utils/types/tns";
import { BrandText } from "../BrandText";
import { ExternalLink } from "../ExternalLink";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextInputCustom } from "../inputs/TextInputCustom";

// TODO: Later, create a reusable FormBase cpt to avoid writing too much code and call it in NameDataForm.tsx. Maybe use react-hook-form ?

export const NameDataForm: React.FC<{
  isMintPath?: boolean;
  btnLabel: string;
  onPressBtn: (values: object) => void;
  initialData: Metadata;
}> = ({ isMintPath, btnLabel, onPressBtn, initialData }) => {
  const [pathId, setPathId] = useState("");
  const { name } = useTNS();
  const [public_bio, setBio] = useState("");
  const [image, setImageUrl] = useState("");
  const [email, setEmail] = useState("");
  const [external_url, setWebsite] = useState("");
  const [twitter_id, setTwitter] = useState("");
  const [discord_id, setDiscord] = useState("");
  const [telegram_id, setTelegrameUsername] = useState("");
  const [keybase_id, setKeybaseIo] = useState("");
  const [validator_operator_address, setValidatorOperatorAddress] =
    useState("");

  const inputStyle = { marginBottom: 12, width: "100%" };
  const profileDataTextStyle = { color: neutral77, fontSize: 16 };

  // Sending the input values
  const handlePressBtn = () => {
    onPressBtn({
      pathId,
      public_name: name, // Useless because TNSContext ?
      public_bio,
      image,
      email,
      external_url,
      twitter_id,
      discord_id,
      telegram_id,
      keybase_id,
      validator_operator_address,
    });
  };

  // Setting initial inputs values (Pre-filled values if existing token)
  useEffect(() => {
    setBio(initialData.public_bio);
    setImageUrl(initialData.image);
    setEmail(initialData.email);
    setWebsite(initialData.external_url);
    setTwitter(initialData.twitter_id);
    setDiscord(initialData.discord_id);
    setTelegrameUsername(initialData.telegram_id);
    setKeybaseIo(initialData.keybase_id);
    setValidatorOperatorAddress(initialData.validator_operator_address);
  }, [initialData]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        width: "100%",
        maxWidth: 396,
        maxHeight: isMintPath ? 852 : 700,
        minHeight: isMintPath ? 852 : 700,
        paddingBottom: 20,
        paddingTop: 24,
        paddingHorizontal: 24,
        backgroundColor: "#000000",
        borderWidth: 1,
        borderColor: neutral33,
        borderRadius: 8,
      }}
    >
      {isMintPath ? (
        <>
          <View
            style={{
              width: 210,
              height: 72,
              minHeight: 72,
              flex: 1,
              marginBottom: 20,
              alignSelf: "flex-start",
            }}
          >
            <BrandText style={{ marginBottom: 8 }}>Profile data</BrandText>
            <BrandText style={profileDataTextStyle}>
              Tip: to generate a PFP URL, use a service like{" "}
              <ExternalLink
                externalUrl="https://www.pinata.cloud/"
                style={{ fontSize: 16 }}
              >
                Pinata
              </ExternalLink>
              .
            </BrandText>
          </View>
          <TextInputCustom
            style={inputStyle}
            label="Path ID (must be unique)"
            placeHolder="Type path ID here"
            value={pathId}
            onChangeText={setPathId}
          />
        </>
      ) : null}
      <TextInputCustom
        style={inputStyle}
        label="NAME"
        placeHolder="Type name here"
        value={name}
        disabled
        regexp={new RegExp(/^[a-zA-Z]+$/)}
      />
      <TextInputCustom
        style={inputStyle}
        label="BIO"
        placeHolder="Type bio here"
        value={public_bio}
        onChangeText={setBio}
      />
      <TextInputCustom
        style={inputStyle}
        label="IMAGE URL"
        placeHolder="Insert image URL here"
        value={image}
        onChangeText={setImageUrl}
      />
      <TextInputCustom
        style={inputStyle}
        label="EMAIL"
        placeHolder="Type email here"
        value={email}
        onChangeText={setEmail}
      />
      <TextInputCustom
        style={inputStyle}
        label="WEBSITE"
        placeHolder="Type/insert link here"
        value={external_url}
        onChangeText={setWebsite}
      />
      <TextInputCustom
        style={inputStyle}
        label="TWITTER"
        placeHolder="Link to Twitter account"
        value={twitter_id}
        onChangeText={setTwitter}
      />
      <TextInputCustom
        style={inputStyle}
        label="DISCORD"
        placeHolder="Link to Discord group"
        value={discord_id}
        onChangeText={setDiscord}
      />
      <TextInputCustom
        style={inputStyle}
        label="TELEGRAM USERNAME"
        placeHolder="@nickname"
        value={telegram_id}
        onChangeText={setTelegrameUsername}
      />
      <TextInputCustom
        style={inputStyle}
        label="KEYBASE.IO"
        placeHolder="Type/insert link here"
        value={keybase_id}
        onChangeText={setKeybaseIo}
      />
      <TextInputCustom
        style={inputStyle}
        label="VALIDATOR OPERATOR ADDRESS"
        placeHolder="Type/insert link here"
        value={validator_operator_address}
        onChangeText={setValidatorOperatorAddress}
      />
      <PrimaryButton
        text={btnLabel}
        onPress={handlePressBtn}
        style={{ marginTop: 8 }}
      />
    </View>
  );
};
