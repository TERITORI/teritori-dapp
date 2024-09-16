import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, Controller, Control } from "react-hook-form";
import { View } from "react-native";
import { z, ZodType } from "zod";

import { PrimaryButton } from "../../../../components/buttons/PrimaryButton";
import { TextInputCustom } from "../../../../components/inputs/TextInputCustom";
import { MediaPreview } from "../../../../components/teritoriNameService/MediaPreview";
import { neutral17 } from "../../../../utils/style/colors";
import { layout } from "../../../../utils/style/layout";

import { ProfileData } from "@/utils/upp";

type ProfileDataWithTmp = ProfileData & {
  _tmp: "";
};

const optionalUrl = z.union([z.string().url(), z.literal("")]);
const optionalStr = z.union([z.string(), z.literal("")]);

const ProfileSchema: ZodType<ProfileData> = z.object({
  displayName: z
    .string()
    .regex(
      /^[\w\s]+$/,
      "display name should contain only a-zA-Z0-9 and spaces",
    ),
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
};

const InputWithController: React.FC<InputWithControllerProps> = ({
  control,
  name,
  label,
  placeHolder,
  required,
  disabled,
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
  onPressBtn: (values: ProfileData) => Promise<void>;
  initialData: ProfileData;
  disabled?: boolean;
}> = ({ btnLabel, onPressBtn, initialData, disabled }) => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid },
  } = useForm<ProfileDataWithTmp>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: { ...initialData },
  });
  const onSubmit = async (data: ProfileData) => {
    console.log(data);
    await onPressBtn(data);

    // if success then reset _tmp
    setValue("_tmp", "");
  };

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
      }}
    >
      <InputWithController
        control={control}
        name="displayName"
        label="Display name"
        placeHolder="Type name here"
        required
      />

      <InputWithController
        control={control}
        name="bio"
        label="Bio"
        placeHolder="Type bio here"
      />

      <Controller
        name="_tmp" // NOTE: react-hook-form does not handle multi-input controller so we have to simulate it
        control={control}
        render={({ field: { onChange } }) => (
          <MediaPreview
            hasPadding={false}
            style={{ marginBottom: 12, width: "100%" }}
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
