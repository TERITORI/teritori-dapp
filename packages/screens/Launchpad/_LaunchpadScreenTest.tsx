import React from "react";
import { View } from "react-native";

import discordSVG from "../../../assets/icons/discord.svg";
import { BrandText } from "../../components/BrandText";
import { PrimaryBox } from "../../components/boxes/PrimaryBox";
import { SecondaryBox } from "../../components/boxes/SecondaryBox";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { _PrimaryButtonOutlineTest } from "../../components/buttons/_PrimaryButtonOutlineTest";
import { _PrimaryButtonTest } from "../../components/buttons/_PrimaryButtonTest";
import { _SecondaryButtonOutlineTest } from "../../components/buttons/_SecondaryButtonOutlineTest";
import { _SecondaryButtonTest } from "../../components/buttons/_SecondaryButtonTest";
import { _TertiaryButtonTest } from "../../components/buttons/_TertiaryButtonTest";
import { neutral22, neutral44 } from "../../utils/style/colors";

export const LaunchpadScreen: React.FC = () => {
  return (
    <View style={{ backgroundColor: "black" }}>
      <PrimaryBox
        paddingHorizontal={20}
        borderRadius={6}
        backgroundColor="#000000"
        height={300}
        width={800}
        style={{ margin: 50 }}
      >
        <BrandText>--Primary box--</BrandText>
      </PrimaryBox>

      <PrimaryBox
        paddingHorizontal={20}
        borderRadius={6}
        backgroundColor="#000000"
        height={150}
        disabled
        width={300}
        style={{ margin: 50 }}
      >
        <BrandText>--Primary box disabled--</BrandText>
      </PrimaryBox>

      <BrandText>-------Primary buttons---------</BrandText>

      <_PrimaryButtonTest
        format="XL"
        text="Button XL"
        style={{ margin: 20 }}
        iconSVG={discordSVG}
      />
      <_PrimaryButtonTest
        format="XL"
        text="Button XL static width too small"
        width={134}
        style={{ margin: 20 }}
        iconSVG={discordSVG}
      />
      <_PrimaryButtonTest
        format="M"
        text="Button M static width"
        width={300}
        style={{ margin: 20 }}
      />
      <_PrimaryButtonTest
        format="XS"
        text="Button XS"
        style={{ margin: 20 }}
        disabled
      />

      <BrandText>-------Primary buttons outline---------</BrandText>

      <_PrimaryButtonOutlineTest
        format="XL"
        text="Button XL"
        style={{ margin: 20 }}
        iconSVG={discordSVG}
      />
      <_PrimaryButtonOutlineTest
        format="M"
        text="Button M static width"
        width={300}
        disabled
        style={{ margin: 20 }}
      />
      <_PrimaryButtonOutlineTest
        format="SM"
        text="Button SM static width"
        width={250}
        style={{ margin: 20 }}
        iconSVG={discordSVG}
      />
      <_PrimaryButtonOutlineTest
        format="XS"
        text="Button XS"
        style={{ margin: 20 }}
      />

      <BrandText>-------Secondary buttons---------</BrandText>

      <_SecondaryButtonTest
        format="XL"
        text="jajajojoje"
        style={{ margin: 20 }}
        disabled
      />
      <_SecondaryButtonTest
        format="M"
        text="jajajojoje"
        style={{ margin: 20 }}
        iconSVG={discordSVG}
      />
      <_SecondaryButtonTest
        format="SM"
        text="jajajojoje"
        width={300}
        style={{ margin: 20 }}
        color="#000000"
        backgroundColor="#FFFFFF"
      />
      <_SecondaryButtonTest
        format="XS"
        text="jajajojoje"
        width={100}
        style={{ margin: 20 }}
      />

      <BrandText>-------Secondary buttons outline---------</BrandText>

      <_SecondaryButtonOutlineTest
        format="XL"
        text="fk ksfjdhjfk"
        style={{ margin: 20 }}
        iconSVG={discordSVG}
      />
      <_SecondaryButtonOutlineTest
        format="M"
        text="fk ksfjdhjfk"
        style={{ margin: 20 }}
        color={neutral44}
        borderColor="yellow"
        backgroundColor={neutral22}
      />
      <_SecondaryButtonOutlineTest
        format="SM"
        text="fk ksfjdhjfk"
        width={300}
        style={{ margin: 20 }}
      />
      <_SecondaryButtonOutlineTest
        format="XS"
        text="fk hjfk"
        width={100}
        disabled
        style={{ margin: 20 }}
      />

      <BrandText>-------Tertiary buttons---------</BrandText>

      <_TertiaryButtonTest
        format="XL"
        text="do that now"
        style={{ margin: 20 }}
        iconSVG={discordSVG}
      />
      <_TertiaryButtonTest
        format="M"
        text="do that now"
        style={{ margin: 20 }}
        disabled
      />
      <_TertiaryButtonTest
        format="SM"
        text="do that now"
        width={300}
        style={{ margin: 20 }}
      />
      <_TertiaryButtonTest
        format="XS"
        text="do that now"
        width={500}
        style={{ margin: 20 }}
      />

      <SecondaryBox
        width={400}
        height={100}
        style={{ margin: 50 }}
        backgroundColor="blue"
        borderRadius={8}
        paddingHorizontal={20}
      />

      <TertiaryBox
        width={400}
        height={100}
        style={{ margin: 50 }}
        borderColor="red"
        backgroundColor="blue"
        borderRadius={8}
        paddingHorizontal={20}
      />

      <PrimaryBox
        width={400}
        height={100}
        style={{ margin: 50 }}
        backgroundColor="blue"
        borderRadius={8}
        paddingHorizontal={20}
      />
    </View>
  );
};
