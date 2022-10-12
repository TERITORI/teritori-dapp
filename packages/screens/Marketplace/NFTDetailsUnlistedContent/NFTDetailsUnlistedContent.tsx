import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Image,
  ViewStyle,
  useWindowDimensions,
  ScrollView,
} from "react-native";
// import certifiedIconSVG from "../../../../assets/icons/certified.svg";
import { Mask } from "react-native-mask-input";

import { BrandText } from "../../../components/BrandText";
// import { SVG } from "../../../components/SVG";
import { SecondaryBox } from "../../../components/boxes/SecondaryBox";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { Dropdown } from "../../../components/forms/Dropdown";
import { FormField } from "../../../components/forms/FormField";
import { neutral77 } from "../../../utils/style/colors";
import { NFTInfo } from "../NFTDetailScreen";
import { ListingCompleteModal } from "./ListingCompleteModal";
import {
  COLUMN_MAX_WIDTH,
  LIST_MY_NFT_COLUMN_MARGIN,
  LIST_MY_NFT_FLEX_BREAK_WIDTH,
  LIST_NFT_FORM_WIDTH,
  NFT_DETAILS_WIDTH,
} from "./contants";
import { validationSchema } from "./validationSchema";

const DATE_TIME_MASK: Mask = (text = "") => {
  const cleanText = text.replace(/\D+/g, "");

  let secondDigitMonthMask = /\d/;

  if (cleanText.charAt(4) === "0") {
    secondDigitMonthMask = /[1-9]/;
  }
  if (cleanText.charAt(4) === "1") {
    secondDigitMonthMask = /[012]/;
  }

  let secondDigitDayMask = /\d/;

  if (cleanText.charAt(6) === "0") {
    secondDigitDayMask = /[1-9]/;
  }
  if (cleanText.charAt(6) === "3") {
    secondDigitDayMask = /[01]/;
  }

  return [
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "/",
    /[0-1]/,
    secondDigitMonthMask,
    "/",
    /[0-3]/,
    secondDigitDayMask,
    /\s/,
    /[0-1]/,
    /\d/,
    ":",
    /[0-5]/,
    /\d/,
  ];
};

const SELL_TOKEN_OPTIONS = [
  {
    label: "TORI",
    key: "tori",
  },
  {
    label: "Solana",
    key: "solana",
  },
  {
    label: "Cosmos Hub",
    key: "cosmos",
  },
  {
    label: "Ethereum",
    key: "ethereum",
  },
  {
    label: "Terra",
    key: "terra",
  },
  {
    label: "BUSD",
    key: "busd",
  },
];

interface NFTDetailSectionProps {
  style?: ViewStyle;
  nftInfo?: NFTInfo;
}

const NFTDetailSection: React.FC<NFTDetailSectionProps> = ({
  style,
  nftInfo,
}) => {
  return (
    <View style={[style]}>
      <BrandText
        style={{
          fontSize: 28,
        }}
      >
        {nftInfo?.name}
      </BrandText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 12,
          marginBottom: 16,
        }}
      >
        <Image
          //TODO: Use collection image from nftInfo
          source={{ uri: nftInfo?.imageURL }}
          style={{
            height: 32,
            width: 32,
            borderRadius: 18,
          }}
        />
        <BrandText
          style={{
            fontSize: 14,
            marginLeft: 12,
            marginRight: 8,
          }}
        >
          {nftInfo?.collectionName}
        </BrandText>
        {/*TODO: uncomment once we have collection infos on nftInfo*/}
        {/* {nftInfo?.collection?.verified && <SVG source={certifiedIconSVG} height={16} width={16} />} */}
      </View>
      <TertiaryBox
        fullWidth
        mainContainerStyle={{
          padding: 16,
          alignItems: "flex-start",
        }}
      >
        <BrandText
          style={{
            color: neutral77,
            fontSize: 12,
          }}
        >
          Contract Address
        </BrandText>
        <BrandText
          style={{
            fontSize: 16,
            marginBottom: 16,
          }}
        >
          {nftInfo?.nftAddress.substr(0, 13)}...
          {nftInfo?.nftAddress.substr(-4)}
        </BrandText>
        <BrandText
          style={{
            color: neutral77,
            fontSize: 12,
            lineHeight: 16,
          }}
        >
          Token ID
        </BrandText>
        <BrandText style={{ fontSize: 16 }}>{nftInfo?.tokenId}</BrandText>
        <BrandText style={{ fontSize: 16, marginTop: 16 }}>
          {/* TODO: Use value from nftInfo */}
          2048 x 2048px.IMAGE(439KB)
        </BrandText>
      </TertiaryBox>
      <SecondaryBox
        style={{
          marginTop: 24,
        }}
      >
        <Image
          source={{ uri: nftInfo?.imageURL }}
          style={{
            height: 464,
            width: 464,
          }}
        />
      </SecondaryBox>
    </View>
  );
};

const ListNFTFormSection: React.FC<{ style: ViewStyle }> = ({ style }) => {
  const [isListingCompleteModal, toggleListingCompleteModal] = useState(false);
  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm({
    defaultValues: {
      sellMethod: "set-price",
      setPrice: null,
      setPriceToken: "TORI",
      royaltyFee: undefined,
      platformFee: null,
      listingType: "list-immediately",
      expirationDateTime: "",
      listingDateTime: "",
      minimumMarkup: "5",
    },
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

  const formValues = watch();

  function handleFormSubmit() {
    handleSubmit(() => {});
    toggleListingCompleteModal(true);
  }

  return (
    <View style={[style]}>
      <ListingCompleteModal
        visible={isListingCompleteModal}
        onClose={() => toggleListingCompleteModal(false)}
      />
      <FormField
        control={control}
        errors={errors}
        formType="button-group"
        name="sellMethod"
        label={{
          text: "Select your sell method",
          isRequired: true,
        }}
        buttons={[
          {
            label: "Set Price",
            value: "set-price",
          },
          {
            label: "Highest Bid",
            value: "highest-bid",
          },
        ]}
      />
      {formValues.sellMethod === "set-price" && (
        <FormField
          control={control}
          errors={errors}
          formType="input"
          name="setPrice"
          label={{
            text: "Set price",
            isRequired: true,
          }}
          placeholder="0.1"
          currencyInputProps={{
            delimiter: ",",
            separator: ".",
            precision: 2,
          }}
          rightComponent={
            <Controller
              control={control}
              name="setPriceToken"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  value={value}
                  onChange={onChange}
                  options={SELL_TOKEN_OPTIONS}
                  style={{
                    position: "absolute",
                    top: 18,
                    right: 18,
                  }}
                />
              )}
            />
          }
          style={{
            zIndex: 1,
          }}
        />
      )}
      {formValues.sellMethod === "highest-bid" && (
        <>
          <FormField
            control={control}
            errors={errors}
            formType="input"
            name="minimumBid"
            label={{
              text: "Minimum bid",
              isRequired: true,
            }}
            placeholder="0.1"
            currencyInputProps={{
              delimiter: ",",
              separator: ".",
              precision: 2,
            }}
            rightComponent={
              <Controller
                control={control}
                name="setPriceToken"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    value={value}
                    onChange={onChange}
                    options={SELL_TOKEN_OPTIONS}
                    style={{
                      position: "absolute",
                      top: 18,
                      right: 18,
                    }}
                  />
                )}
              />
            }
            style={{
              zIndex: 2,
            }}
          />
          <FormField
            control={control}
            errors={errors}
            formType="input"
            name="buyoutPrice"
            placeholder="O.1 "
            label={{
              text: "Buyout  price",
              isRequired: true,
            }}
            helperText="Buyers can close the deal directly at this price."
            currencyInputProps={{
              delimiter: ",",
              separator: ".",
              precision: 2,
            }}
            rightComponent={
              <Controller
                control={control}
                name="setPriceToken"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    value={value}
                    onChange={onChange}
                    options={SELL_TOKEN_OPTIONS}
                    style={{
                      position: "absolute",
                      top: 18,
                      right: 18,
                    }}
                  />
                )}
              />
            }
            style={{
              zIndex: 1,
            }}
          />
        </>
      )}

      <FormField
        control={control}
        errors={errors}
        formType="input"
        name="royaltyFee"
        placeholder="O.1 TORI"
        label={{
          text: "Royalty fee",
          isRequired: true,
        }}
        currencyInputProps={{
          delimiter: ",",
          separator: ".",
          precision: 2,
          suffix: " TORI",
        }}
        helperText="1% of the total fee will be paid to the original creator / beneficiary as a Royalty payment."
      />
      <FormField
        control={control}
        errors={errors}
        formType="input"
        name="platformFee"
        placeholder="O.1 TORI"
        currencyInputProps={{
          delimiter: ",",
          separator: ".",
          precision: 2,
          suffix: " TORI",
        }}
        label={{
          text: "Platform fee",
          isRequired: true,
        }}
        helperText="1% of the total sale will be paid to Binance as a Platform fee."
      />

      {formValues.sellMethod === "highest-bid" && (
        <FormField
          control={control}
          errors={errors}
          formType="button-group"
          name="minimumMarkup"
          label={{
            text: "Minimum markup in",
            isRequired: true,
          }}
          buttons={[
            {
              label: "5%",
              value: "5",
            },
            {
              label: "10%",
              value: "10",
            },
            {
              label: "20%",
              value: "20",
            },
          ]}
          helperText="When the bidder’s bid is allowed to be greater than the minimum price increase. If it is less than the minimum price increase, the bid cannot be made."
        />
      )}

      <FormField
        control={control}
        errors={errors}
        formType="button-group"
        name="listingType"
        label={{
          text:
            formValues.sellMethod === "set-price"
              ? "Starts in"
              : "Auction list time",
          isRequired: true,
        }}
        buttons={[
          {
            label: "List immediately",
            value: "list-immediately",
          },
          {
            label: "Custom list time",
            value: "custom-list-time",
          },
        ]}
      />
      {formValues.listingType === "custom-list-time" && (
        <FormField
          control={control}
          errors={errors}
          formType="input"
          name="listingDateTime"
          label={{
            text: "Listing date",
            isRequired: true,
          }}
          mask={DATE_TIME_MASK}
          placeholder="YYYY/MM/DD HH:mm"
        />
      )}
      <FormField
        control={control}
        errors={errors}
        formType="input"
        name="expirationDateTime"
        label={{
          text: "Expiration date",
          isRequired: true,
        }}
        mask={DATE_TIME_MASK}
        placeholder="YYYY/MM/DD HH:mm"
        helperText={`No less than 12 hours, no more than 7 days.
        
Be aware that once your NFT is listed in Auction, there are limited chances of Delisting and we will reject your Delisting request if there are already other users bidding on it.`}
      />

      <PrimaryButton
        text="Submit"
        size="XL"
        width={156}
        onPress={handleFormSubmit}
      />
    </View>
  );
};

interface NFTDetailsUnlistedContentProps {
  id: string;
  nftInfo?: NFTInfo;
}

export const NFTDetailsUnlistedContent: React.FC<
  NFTDetailsUnlistedContentProps
> = ({ nftInfo }) => {
  const { width } = useWindowDimensions();
  const isBreakPoint = width < LIST_MY_NFT_FLEX_BREAK_WIDTH;
  return (
    <ScrollView>
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 48,
          paddingHorizontal: 32,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <NFTDetailSection
          style={{
            marginRight: isBreakPoint ? 0 : LIST_MY_NFT_COLUMN_MARGIN,
            width: isBreakPoint ? "100%" : NFT_DETAILS_WIDTH,
            maxWidth: COLUMN_MAX_WIDTH,
          }}
          nftInfo={nftInfo}
        />
        <ListNFTFormSection
          style={{
            width: isBreakPoint ? "100%" : LIST_NFT_FORM_WIDTH,
            maxWidth: COLUMN_MAX_WIDTH,
            marginTop: isBreakPoint ? 48 : 0,
          }}
        />
      </View>
    </ScrollView>
  );
};
