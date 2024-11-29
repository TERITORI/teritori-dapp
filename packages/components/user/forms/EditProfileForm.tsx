import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo, useState } from "react";
import { useForm, Controller, Control } from "react-hook-form";
import { View } from "react-native";
import { z, ZodType } from "zod";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { AvailableNamesInput } from "@/components/inputs/AvailableNamesInput";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { MediaPreview } from "@/components/teritoriNameService/MediaPreview";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import { NetworkKind } from "@/networks";
import { neutral17 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";
import { ProfileData } from "@/utils/upp";

type ProfileDataWithTmp = ProfileData & {
  _tmp: string;
};

const optionalUrl = z.union([z.string().url().nullish(), z.literal("")]);
const optionalStr = z.union([z.string().nullish(), z.literal("")]);
const optionalAlphanumericAndSpaces = z.union([
  z
    .string()
    .regex(/^[\w\s]+$/, "should contain only a-zA-Z0-9 and spaces")
    .nullish(),
  z.literal(""),
]);

const optionalAlphanumeric = z.union([
  z
    .string()
    .regex(/^\w+$/, "should contain only a-zA-Z0-9 and spaces")
    .nullish(),
  z.literal(""),
]);

const ProfileSchema: ZodType<ProfileData> = z.object({
  displayName: optionalAlphanumericAndSpaces,
  avatarURL: optionalStr,
  bannerURL: optionalUrl,
  bio: optionalStr,
});

type InputWithControllerProps = {
  control: Control<any>;
  name: string;
  label: string;
  placeHolder: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
};

const InputWithController: React.FC<InputWithControllerProps> = ({
  control,
  name,
  label,
  placeHolder,
  required,
  disabled,
  multiline,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => {
        return (
          <TextInputCustom
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
            disabled={disabled}
            rules={{ required }}
            error={error?.message}
            name={name}
            label={label}
            placeHolder={placeHolder}
            containerStyle={{ marginBottom: 12, width: "100%" }}
            noBrokenCorners
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            boxMainContainerStyle={
              disabled ? { backgroundColor: neutral17 } : undefined
            }
          />
        );
      }}
    />
  );
};

export const EditProfileForm: React.FC<{
  btnLabel: string;
  onPressBtn: (profileData: ProfileData, username: string) => Promise<void>;
  initialData: ProfileData;
  disabled?: boolean;
  initialUsername?: string;
  testID?: string;
}> = ({
  btnLabel,
  onPressBtn,
  initialData,
  disabled,
  initialUsername,
  testID,
}) => {
  const network = useSelectedNetworkInfo();

  const initialUsernameValue = useMemo(() => {
    if (!initialUsername) return "";

    let suffix = "";

    switch (network?.kind) {
      case NetworkKind.Cosmos:
        suffix = network.nameServiceTLD || ".tori";
        break;
      case NetworkKind.Gno:
        suffix = ".gno";
        break;
      default:
        throw Error(`unsupported network kind ${network?.kind}`);
    }

    return initialUsername.substring(0, initialUsername.lastIndexOf(suffix));
  }, [initialUsername, network]);

  const [usernameValue, setUsernameValue] = useState(initialUsernameValue);
  const [usernameError, setUsernameError] = useState("");

  const username = useMemo(() => {
    if (!usernameValue) return "";

    let res = usernameValue;
    switch (network?.kind) {
      case NetworkKind.Gno:
        res = usernameValue + ".gno";
        break;
      case NetworkKind.Cosmos:
        res = usernameValue + network?.nameServiceTLD;
        break;
    }

    return res;
  }, [usernameValue, network]);

  const { control, handleSubmit, setValue, getValues } =
    useForm<ProfileDataWithTmp>({
      resolver: zodResolver(ProfileSchema),
      defaultValues: { ...initialData },
    });

  const onSubmit = async (profileData: ProfileData) => {
    await onPressBtn(profileData, username);

    // if success then reset _tmp
    setValue("_tmp", "");
  };

  return (
    <View>
      <AvailableNamesInput
        error={usernameError}
        readOnly={!!initialUsernameValue}
        variant="regular"
        nameValue={usernameValue}
        label="Username"
        name={username}
        placeHolder="Type username here"
        value={usernameValue}
        onError={setUsernameError}
        onChangeText={(value) => {
          setUsernameValue(value);

          try {
            optionalAlphanumeric.parse(value);
            setUsernameError("");
          } catch (e) {
            console.warn(e);
            let msg = `invalid username`;
            if (e instanceof z.ZodError) {
              msg = e.issues[0].message;
            }
            setUsernameError(msg);
          }
        }}
        style={{
          marginBottom: usernameError ? 0 : layout.spacing_x2,
        }}
      />

      <InputWithController
        control={control}
        name="displayName"
        label="Display name"
        placeHolder="Type display name here"
        required
      />

      <InputWithController
        control={control}
        name="bio"
        label="Bio"
        placeHolder="Type bio here"
        multiline
      />

      <Controller
        name="_tmp" // NOTE: react-hook-form does not handle multi-input controller so we have to simulate it
        control={control}
        render={({ field: { onChange } }) => (
          <MediaPreview
            hasPadding={false}
            textInputsStyle={{ marginBottom: 12, width: "100%" }}
            variant="regular"
            avatarImageUrl={getValues("avatarURL") || ""}
            bannerImageUrl={getValues("bannerURL") || ""}
            setAvatarImageUrl={(url) => {
              onChange(url); // Trigger onChange to fire changed event
              setValue("avatarURL", url as string);
            }}
            setBannerImageUrl={(url) => {
              onChange(url); // Trigger onChange to fire changed event
              setValue("bannerURL", url as string);
            }}
          />
        )}
      />

      <View style={{ alignItems: "center" }}>
        <PrimaryButton
          size="M"
          text={btnLabel}
          disabled={disabled || !!usernameError}
          onPress={handleSubmit(onSubmit)}
          boxStyle={{ marginTop: layout.spacing_x1 }}
          loader
          testID={testID}
        />
      </View>
    </View>
  );
};
