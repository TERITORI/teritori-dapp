import React from "react";
import { Image, Linking, TouchableOpacity, View } from "react-native";
import { CreditCardIcon } from "react-native-heroicons/solid";

import binanceLogo from "../../../../../assets/icons/Binance_Logo.svg";
import teritoriLogo from "../../../../../assets/icons/networks/teritori-circle.svg";
import squidRouter from "../../../../../assets/icons/squidrouter.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../../../components/buttons/PrimaryButton";
import { DiscordButton } from "../../../../components/footers/Footer";
import { GradientText } from "../../../../components/gradientText";
import { SeparatorGradient } from "../../../../components/separators/SeparatorGradient";
import { primaryColor, secondaryColor } from "../../../../utils/style/colors";
import { fontSemibold16, fontSemibold24 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

interface Method {
  name: string;
  icon: React.ReactNode;
}
export const HowToBuy: React.FC = () => {
  return (
    <TertiaryBox fullWidth style={{ maxWidth: 600, alignSelf: "center" }}>
      <View style={{ width: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            padding: layout.spacing_x2_5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SVG source={teritoriLogo} height={32} width={32} />
              <BrandText
                style={{
                  marginLeft: layout.spacing_x2,
                }}
              >
                How to buy
              </BrandText>
            </View>
          </View>
        </View>

        <View style={{ width: "100%", paddingHorizontal: layout.spacing_x2_5 }}>
          <SeparatorGradient style={{ marginBottom: layout.spacing_x2_5 }} />
          <View
            style={{
              alignItems: "center",
              paddingBottom: layout.spacing_x2_5,
            }}
          >
            <BuyingMethods />
          </View>
        </View>
      </View>
    </TertiaryBox>
  );
};

const BuyingStep: React.FC<{ selectedMethod: string }> = ({
  selectedMethod,
}) => {
  const Paragraph: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <BrandText
        style={[
          fontSemibold16,
          { paddingBottom: layout.spacing_x2, lineHeight: 22 },
        ]}
      >
        {children}
      </BrandText>
    );
  };

  const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <>
        {" "}
        <SeparatorGradient style={{ marginBottom: layout.spacing_x2_5 }} />
        <View
          style={{
            width: "100%",
            paddingBottom: layout.spacing_x2_5,
          }}
        >
          {children}
        </View>
      </>
    );
  };
  switch (selectedMethod) {
    case "Card":
      return (
        <Container>
          <GradientText
            gradientType="blueExtended"
            style={[fontSemibold24, { paddingBottom: layout.spacing_x2_5 }]}
          >
            Buy with your Credit/Debit Card
          </GradientText>
          <Paragraph>
            You can buy TORI with your credit card or debit card and on some
            countries even bank tranfer using KADO.
          </Paragraph>
          <Paragraph>
            KADO is the industry leader in cryptocurrency purchases fiat money,
            and offer the fastest processing times and lowers trasaction fees.
            It suports 150+ countries and 30+ currencies.
          </Paragraph>
          <Paragraph>
            First you will need to create an account on KADO. And have your
            wallet to store your OSMO (we will swap OSMO into TORI at a later
            step).
          </Paragraph>
          <Paragraph>
            We recommend using Keplr Wallet or Leap Wallet, you can download it
            on your phone or computer.
          </Paragraph>
          <Image
            source={require("../../../../../assets/icons/kado/Product.jpg")}
            style={{
              height: 300,
              marginBottom: layout.spacing_x2_5,
            }}
            resizeMode="contain"
          />
          <Paragraph>
            Once you have your OSMO in your wallet, you can swap it for TORI,
            via the above Swap button. Or if you prefer using the Osmosis DEX
            website, you can do it there too.
          </Paragraph>
          <PrimaryButton
            style={{
              alignSelf: "center",
              marginVertical: layout.spacing_x2_5,
            }}
            text="Buy with KADO"
            onPress={() => alert("todo load iframe")}
          />
          <Paragraph>
            If you have any questions, please join our Discord <DiscordButton />{" "}
            and ask in the #support channel.
          </Paragraph>
        </Container>
      );
    case "Bridge":
      return (
        <Container>
          <GradientText
            gradientType="blueExtended"
            style={[fontSemibold24, { paddingBottom: layout.spacing_x2_5 }]}
          >
            Bridge your Crypto to Osmosis
          </GradientText>
          <Paragraph>
            You can use your existing crypto assets to buy TORI. You will need
            to bridge your crypto to Osmosis.
          </Paragraph>
          <Paragraph>
            You can bridge using Squid Router, which is a bridge that supports
            many different crypto, including BTC, ETH, and most stablecoins such
            as USDT, USDC, DAI, etc.
          </Paragraph>
          <Paragraph>
            Of course, you will need to have your own wallet to store your OSMO
            and later to use the Osmosis DEX. We recommend using Keplr Wallet or
            Leap Wallet, you can download it on your phone or computer.
          </Paragraph>
          <PrimaryButton
            style={{
              alignSelf: "center",
              marginVertical: layout.spacing_x2_5,
            }}
            text="Bridge with Squid Router"
            onPress={() => Linking.openURL("https://squidrouter.com/")}
          />
        </Container>
      );
    case "Centralized Exchange":
      return (
        <Container>
          <GradientText
            gradientType="blueExtended"
            style={[fontSemibold24, { paddingBottom: layout.spacing_x2_5 }]}
          >
            Buy ATOM or OSMO on any Centralized Exchange
          </GradientText>
          <Paragraph>
            The first step is to buy ATOM or OSMO on any centralized exchange,
            such as Kraken, Binance, Coinbase, Nexo, etc.
          </Paragraph>
          <Paragraph>
            The second step is to withdraw your ATOM or OSMO to your own
            custodial wallet, such as Keplr Wallet or Leap Wallet.
          </Paragraph>
          <Paragraph>
            Once you have your OSMO in your wallet, you can swap it for TORI,
            via the above Swap button. Or if you prefer using the Osmosis DEX
            website, you can do it there too.
          </Paragraph>
        </Container>
      );
  }
  return <></>;
};

const BuyingMethods = () => {
  const [selectedMethod, setSelectedMethod] = React.useState<string>("Card");
  const methods = [
    {
      name: "Card",
      icon: <CreditCardIcon height={80} width={80} color={primaryColor} />,
    },
    {
      name: "Bridge",
      icon: (
        <SVG
          // width={100}
          height={80}
          fill={primaryColor}
          source={squidRouter}
        />
      ),
    },
    {
      name: "Centralized Exchange",
      icon: (
        <SVG width={80} height={80} fill={primaryColor} source={binanceLogo} />
      ),
    },
  ];

  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal: layout.spacing_x2_5,
        justifyContent: "space-evenly",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {methods.map((method) => (
        <BuyingMethod
          key={method.name}
          method={method}
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
        />
      ))}
      <BuyingStep selectedMethod={selectedMethod} />
    </View>
  );
};

const BuyingMethod: React.FC<{
  method: Method;
  selectedMethod: string;
  setSelectedMethod: any;
}> = ({ method, selectedMethod, setSelectedMethod }) => {
  return (
    <TouchableOpacity
      style={{
        marginRight: layout.spacing_x1,
        flexWrap: "wrap",
        height: 200,
      }}
      onPress={() => setSelectedMethod(method.name)}
    >
      <TertiaryBox
        mainContainerStyle={{
          borderColor:
            method.name === selectedMethod ? primaryColor : secondaryColor,
          borderRadius: 12,
          padding: layout.spacing_x1_5,
          width: 120,
        }}
      >
        <BrandText
          style={[
            fontSemibold16,
            { width: 90, height: 60, paddingBottom: layout.spacing_x2_5 },
          ]}
        >
          {method.name}
        </BrandText>

        {method.icon}
      </TertiaryBox>
    </TouchableOpacity>
  );
};
