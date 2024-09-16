import React, { useEffect, useState } from "react";
import { View, ViewStyle } from "react-native";

import { MediaPreview } from "./MediaPreview";
import { Metadata } from "../../contracts-clients/teritori-name-service/TeritoriNameService.types";
import { neutral17, neutral77 } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { ExternalLink } from "../ExternalLink";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextInputCustom } from "../inputs/TextInputCustom";

export const NameDataForm: React.FC<{
  isMintPath?: boolean;
  btnLabel: string;
  onPressBtn: (values: Metadata) => Promise<void>;
  initialData: Metadata;
  disabled?: boolean;
}> = ({ isMintPath, btnLabel, onPressBtn, initialData, disabled }) => {
  const [pathId, setPathId] = useState("");
  const [publicName, setPublicName] = useState("");
  const [public_bio, setBio] = useState("");
  const [avatarImageUrl, setAvatarImageUrl] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [email, setEmail] = useState("");
  const [external_url, setWebsite] = useState("");
  const [twitter_id, setTwitter] = useState("");
  const [discord_id, setDiscord] = useState("");
  const [telegram_id, setTelegrameUsername] = useState("");
  const [keybase_id, setKeybaseIo] = useState("");
  const [validator_operator_address, setValidatorOperatorAddress] =
    useState("");

  const inputStyle: ViewStyle = { marginBottom: 12, width: "100%" };
  const profileDataTextStyle = { color: neutral77, fontSize: 16 };

  // Sending the input values
  const handlePressBtn = () =>
    onPressBtn({
      pathId,
      public_name: publicName,
      public_bio,
      image: avatarImageUrl,
      public_profile_header: bannerImageUrl,
      email,
      external_url,
      twitter_id,
      discord_id,
      telegram_id,
      keybase_id,
      validator_operator_address,
    });

  // Setting initial inputs values (Pre-filled values if existing token)
  useEffect(() => {
    setBio(initialData.public_bio || "");
    setAvatarImageUrl(initialData.image || "");
    setBannerImageUrl(initialData.public_profile_header || "");
    setEmail(initialData.email || "");
    setWebsite(initialData.external_url || "");
    setTwitter(initialData.twitter_id || "");
    setDiscord(initialData.discord_id || "");
    setTelegrameUsername(initialData.telegram_id || "");
    setKeybaseIo(initialData.keybase_id || "");
    setValidatorOperatorAddress(initialData.validator_operator_address || "");
    setPublicName(initialData.public_name || "");
  }, [initialData]);

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
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
              marginTop: 4,
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

          {/*// TODO: Refacto TextInputCustom and fix usages*/}

          <TextInputCustom<Metadata>
            name="pathId"
            containerStyle={inputStyle}
            label="Path ID (must be unique)"
            placeHolder="Type path ID here"
            value={pathId}
            onChangeText={setPathId}
            squaresBackgroundColor={neutral17}
          />
        </>
      ) : null}
      <TextInputCustom<Metadata>
        name="name"
        containerStyle={inputStyle}
        label="Name"
        rules={{ required: true }}
        noBrokenCorners
        variant="labelOutside"
        placeHolder="Type name here"
        value={publicName}
        onChangeText={setPublicName}
        regexp={new RegExp(/^[a-zA-Z]+$/)}
        squaresBackgroundColor={neutral17}
      />
      <TextInputCustom<Metadata>
        name="public_bio"
        containerStyle={inputStyle}
        label="Bio"
        noBrokenCorners
        variant="labelOutside"
        placeHolder="Type bio here"
        value={public_bio}
        onChangeText={setBio}
        squaresBackgroundColor={neutral17}
      />
      <MediaPreview
        style={inputStyle}
        avatarImageUrl={avatarImageUrl}
        bannerImageUrl={bannerImageUrl}
        setAvatarImageUrl={setAvatarImageUrl}
        setBannerImageUrl={setBannerImageUrl}
      />

      <TextInputCustom<Metadata>
        name="email"
        containerStyle={inputStyle}
        label="Email"
        noBrokenCorners
        variant="labelOutside"
        placeHolder="Type email here"
        value={email}
        onChangeText={setEmail}
        squaresBackgroundColor={neutral17}
      />
      <TextInputCustom<Metadata>
        name="external_url"
        containerStyle={inputStyle}
        label="Website"
        noBrokenCorners
        variant="labelOutside"
        placeHolder="Type/insert link here"
        value={external_url}
        onChangeText={setWebsite}
        squaresBackgroundColor={neutral17}
      />
      <TextInputCustom<Metadata>
        name="twitter_id"
        containerStyle={inputStyle}
        label="Twitter (X)"
        noBrokenCorners
        variant="labelOutside"
        placeHolder="Link to Twitter account"
        value={twitter_id}
        onChangeText={setTwitter}
        squaresBackgroundColor={neutral17}
      />
      <TextInputCustom<Metadata>
        name="discord_id"
        containerStyle={inputStyle}
        label="Discord"
        noBrokenCorners
        variant="labelOutside"
        placeHolder="Link to Discord"
        value={discord_id}
        onChangeText={setDiscord}
        squaresBackgroundColor={neutral17}
      />
      <TextInputCustom<Metadata>
        name="telegram_id"
        containerStyle={inputStyle}
        label="Telegram Username"
        noBrokenCorners
        variant="labelOutside"
        placeHolder="@nickname"
        value={telegram_id}
        onChangeText={setTelegrameUsername}
        squaresBackgroundColor={neutral17}
      />
      <TextInputCustom<Metadata>
        name="keybase_id"
        containerStyle={inputStyle}
        label="Keybase.io"
        noBrokenCorners
        variant="labelOutside"
        placeHolder="Type/insert link here"
        value={keybase_id}
        onChangeText={setKeybaseIo}
        squaresBackgroundColor={neutral17}
      />
      <TextInputCustom<Metadata>
        name="validator_operator_address"
        containerStyle={inputStyle}
        label="Validator Operator Address"
        noBrokenCorners
        variant="labelOutside"
        placeHolder="Type/insert link here"
        value={validator_operator_address}
        onChangeText={setValidatorOperatorAddress}
        squaresBackgroundColor={neutral17}
      />
      <PrimaryButton
        size="M"
        text={btnLabel}
        disabled={disabled}
        onPress={handlePressBtn}
        boxStyle={{ marginTop: layout.spacing_x1 }}
        loader
      />
    </View>
  );
};
