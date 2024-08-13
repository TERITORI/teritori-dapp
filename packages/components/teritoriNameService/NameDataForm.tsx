import React from "react";
import { View, ViewStyle } from "react-native";
import { useForm, Controller, Control } from "react-hook-form";

import { MediaPreview } from "./MediaPreview";
import { Metadata } from "../../contracts-clients/teritori-name-service/TeritoriNameService.types";
import { neutral17, neutral77 } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { ExternalLink } from "../ExternalLink";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextInputCustom } from "../inputs/TextInputCustom";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValid, z, ZodType } from "zod";

// type ProfileFormData = {
//   pathId?: string | null;
//   publicName: string | null;
//   publicBio?: string | null;
//   avatarImageUrl?: string | null;
//   bannerImageUrl?: string | null;
//   email?: string | null;
//   externalUrl?: string | null;
//   twitterId?: string | null;
//   discordId?: string | null;
//   telegramId?: string | null;
//   keybaseId?: string | null;
//   validatorOperatorAddress?: string | null;
// };

// type ProfileFormDataWithTmp = ProfileFormData & {
//   _tmp: "";
// };

type MetadataWithTmp = Metadata & {
  _tmp: "";
};

const optionalUrl = z.union([z.string().url().nullish(), z.literal("")]);
const optionalStr = z.union([z.string().nullish(), z.literal("")]);
const optionalEmail = z.union([z.string().email().nullish(), z.literal("")]);

const ProfileSchema: ZodType<Metadata> = z.object({
  path_id: optionalStr,
  public_name: z
    .string()
    .regex(new RegExp(/^[a-zA-Z]+$/), "public name should be a-zA-Z"),
  public_bio: optionalStr,
  image: optionalUrl,
  public_profile_header: optionalUrl,
  email: optionalEmail,
  external_url: optionalUrl,
  twitter_id: optionalStr,
  discord_id: optionalStr,
  telegram_id: optionalStr,
  keybase_id: optionalStr,
  validator_operator_address: optionalUrl,
});

type InputWithControllerProps = {
  control: Control<any>;
  name: string;
  label: string;
  placeHolder: string;
  required?: boolean;
};

const inputStyle: ViewStyle = { marginBottom: 12, width: "100%" };

const InputWithController: React.FC<InputWithControllerProps> = ({
  control,
  name,
  label,
  placeHolder,
  required,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => {
        console.log(value, error);
        return (
          <TextInputCustom<Metadata>
            rules={{ required }}
            error={error?.message}
            name={name}
            label={label}
            placeHolder={placeHolder}
            containerStyle={inputStyle}
            noBrokenCorners={true}
            variant="labelOutside"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            squaresBackgroundColor={neutral17}
          />
        );
      }}
    />
  );
};

export const NameDataForm: React.FC<{
  isMintPath?: boolean;
  btnLabel: string;
  onPressBtn: (values: Metadata) => Promise<void>;
  initialData: Metadata;
  disabled?: boolean;
}> = ({ isMintPath, btnLabel, onPressBtn, initialData, disabled }) => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid },
  } = useForm<MetadataWithTmp>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: Metadata) => {
    console.log(data);
    await onPressBtn(data);

    // if success then reset _tmp
    setValue("_tmp", "");
  };

  const textStyle = { color: neutral77, fontSize: 16 };

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
            <BrandText style={textStyle}>
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

          <InputWithController
            control={control}
            name="path_id"
            label="Path ID (must be unique)"
            placeHolder="Type path ID here"
          />
        </>
      ) : null}
      <InputWithController
        control={control}
        name="public_name"
        label="Name"
        placeHolder="Type name here"
        required
      />

      <InputWithController
        control={control}
        name="public_bio"
        label="Bio"
        placeHolder="Type bio here"
      />

      <Controller
        name="_tmp" // NOTE: react-hook-form does not handle multi-input controller so we have to simulate it
        control={control}
        render={({ field: { onChange } }) => (
          <MediaPreview
            style={inputStyle}
            avatarImageUrl={getValues("image") || ""}
            bannerImageUrl={getValues("public_profile_header") || ""}
            setAvatarImageUrl={(url) => {
              onChange(url); // Trigger onChange to fire changed event
              setValue("image", url as string);
            }}
            setBannerImageUrl={(url) => {
              onChange(url); // Trigger onChange to fire changed event
              setValue("public_profile_header", url as string);
            }}
          />
        )}
      />

      <InputWithController
        control={control}
        name="email"
        label="Email"
        placeHolder="Type email here"
      />

      <InputWithController
        control={control}
        name="external_url"
        label="Website"
        placeHolder="Type/insert link here"
      />

      <InputWithController
        control={control}
        name="twitter_id"
        label="Twitter (X)"
        placeHolder="Link to Twitter account"
      />

      <InputWithController
        control={control}
        name="discord_id"
        label="Discord"
        placeHolder="Link to Discord"
      />

      <InputWithController
        control={control}
        name="telegram_id"
        label="Telegram Username"
        placeHolder="@nickname"
      />

      <InputWithController
        control={control}
        name="keybase_id"
        label="Keybase.io"
        placeHolder="Type/insert link here"
      />

      <InputWithController
        control={control}
        name="validator_operator_address"
        label="Validator Operator Address"
        placeHolder="Type/insert link here"
      />

      <PrimaryButton
        size="M"
        text={btnLabel}
        disabled={disabled}
        onPress={handleSubmit(onSubmit)}
        boxStyle={{ marginTop: layout.spacing_x1 }}
        loader
      />
    </View>
  );
};
