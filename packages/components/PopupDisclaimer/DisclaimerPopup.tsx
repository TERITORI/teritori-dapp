import React, { useState } from "react";
import { ScrollView, View, ViewStyle, StyleProp } from "react-native";
import { useSelector } from "react-redux";

import {
  selectAlreadyVisited,
  setAlreadyVisited,
} from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { neutral44 } from "../../utils/style/colors";
import { modalMarginPadding } from "../../utils/style/modals";
import { BrandText } from "../BrandText";
import { PrimaryButton } from "../buttons/PrimaryButton";
import ModalDisclaimer from "../modals/ModalDisclaimer";

const Separator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
  <View
    style={[
      { borderBottomWidth: 1, borderColor: neutral44, width: "100%" },
      style,
    ]}
  />
);

const TextDisclaimer: React.FC = () => {
  return (
    <ScrollView style={{ height: 610 }}>
      <View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <BrandText
            style={{
              fontSize: 15,
              color: "white",
              width: 1000,
            }}
          >
            <strong>IMPORTANT</strong>
          </BrandText>

          <BrandText
            style={{
              fontSize: 12,
              color: "white",
              width: 1000,
            }}
          >
            <br />
            Teritori is not a company. Teritori is an open source community
            project experimenting decentralized social organizations and
            inter-community cooperation. Offering a brand new multi-chain
            experience, this dApp integrate various decentralized protocols and
            ecosystem into an single all-in-one software.
            <br />
            <br />
            Teritori is a decentralized peer-to-peer blockchain and is made up
            of public and open-source software.
            <br />
            <br />
            1. Restrictions. The services and products presented on this website
            https://teritori.com/ (the “Website”) may be subject to restrictions
            in certain countries or with respect to certain persons. <br />
            However, any user of the Website should check beforehand, if
            necessary, with his usual advisers that he is entitled to use the
            services and products presented in view of his tax and legal status.
            <br />
            <br />
            This Website is not available for US citizen or national, or if you
            act for a company that is domiciled in the US or majority owned by
            US citizens or US companies. <br />
            This Website is not available for citizens or companies that are
            subject to sanctions, or any prohibited person resident or national
            of the following countries: Afghanistan, Albania, Angola,
            Azerbaijan, Bosnia Herzegovina, Bahamas, Barbados, Burma, Botswana,
            Burkina Faso, Byelorussia, Burundi, Cayman Islands, Cambodia,
            Cameroon, Crimea (Ukraine), Chad, China, Congo, Democratic Republic
            of Congo, Cuba, Ethiopia, Eritrea, Fiji, Palau, Ghana, Guinea,
            Guinea-Bissau, Haiti, Iran, Iraq, Jamaica, Jordan, Lao People&#39;s
            Democratic Republic, Uganda, Liberia, Libya, Madagascar, Mali,
            Malta, Morocco, Mozambique, Nicaragua, Nigeria, North Korea,
            Pakistan, Panama, Philippines, Puerto Rico, Russia, Senegal,
            Somalia, Sri Lanka, Sudan, Syria, Tajikistan, Trinidad and Tobago,
            Turkey, Turkmenistan, United States, Uzbekistan, Vanuatu, Venezuela,
            Virgin Islands, Yemen, Zimbabwe.
            <br />
            <br />
            2. Warning. We strongly recommend that you do not purchase NFTs if
            you are not an expert in cryptocurrencies, digital assets and
            blockchain technology. Even if you have knowledge of the technology,
            you should consult your own lawyer, accountant, and other
            professionals whereso required. The company will not be responsible
            in any way for any loss incurred by you resulting from the purchase
            of NFTs.
            <br />
            <br />
            3. Risks. You are currently entering an unaudited decentralized
            application that is currently considered an experimental alpha
            version. Please be aware of the risks associated with this software
            and be careful to use these early features only in a testing
            approach. You acknowledge and accept that the use of the Teritori
            protocol is entirely at your own risks, and that doing so could lead
            to partial or full loss of deposits. You take full responsibility
            for your use of Teritori and the Teritori protocol and acknowledge
            that you use it on the basis of your own analysis.
            <br />
            <br />
            Your use of Teritori involves various risks, including, but not
            limited to losses due to notably the fluctuation of prices of tokens
            in a trading pair or liquidity pool, impermanent loss, etc. Before
            using Teritori, you should review the relevant documentation to make
            sure you understand how Teritori works.
            <br />
            <br />
            AS DESCRIBED IN TERITORI’S DOCUMENTATION, TERITORI IS PROVIDED “AS
            IS”, AT YOUR OWN RISKS, AND WITHOUT WARRANTIES OF ANY KIND.
            <br />
            <br />
            Although the Company developed much of the initial code for the
            Teritori protocol, it does not provide, own, or control the Teritori
            protocol, which is run by a decentralized validator set. Upgrades
            and modifications to the Teritori protocol are managed in a
            community-driven way by holders of the TORI Tokens. No developer or
            entity involved in creating the Teritori protocol will be liable for
            any claims or damages whatsoever associated with your use, inability
            to use, or your interaction with other users of the Teritori
            protocol, including any direct, indirect, incidental, special,
            exemplary, punitive or consequential damages, or loss of profits,
            cryptocurrencies, tokens, or anything else of value.
            <br />
          </BrandText>
          <View style={{ width: 10 }} />
          <View
            style={{
              justifyContent: "flex-end",
              flexDirection: "row",
              flex: 1,
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default function DisclaimerPopup() {
  const [firstVerif, setfirstVerif] = useState(false);
  const [secondVerif, setsecondVeriff] = useState(false);
  const alreadyVisited = useSelector(selectAlreadyVisited);
  const dispatch = useAppDispatch();

  const handleFirstVerif = () => setfirstVerif(!firstVerif);
  const handleSecondVerif = () => setsecondVeriff(!secondVerif);

  const onPressSubmitButton = () => {
    if (firstVerif && secondVerif) {
      dispatch(setAlreadyVisited(true));
    } else {
      alert("Please read the disclaimer and check the boxes to continue");
    }
  };

  return (
    <>
      <View>
        <ModalDisclaimer
          label="WARNING"
          visible={!alreadyVisited}
          childrenBottom={
            <>
              <Separator />
              <View
                style={{
                  flexDirection: "row",
                  flex: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: modalMarginPadding,
                }}
              >
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 4,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 5,
                    }}
                  >
                    <View>
                      <input
                        type="checkbox"
                        onChange={handleFirstVerif}
                        id="firstVerif"
                        name="firstVerif"
                      />
                    </View>

                    <View>
                      <BrandText
                        style={{
                          fontSize: 12,
                          color: "white",
                          marginLeft: 15,
                        }}
                      >
                        I confirm that I have react, understood and accept the
                        Terms of Use and the Risks Statement
                      </BrandText>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      flex: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 5,
                    }}
                  >
                    <View>
                      <input
                        type="checkbox"
                        onChange={handleSecondVerif}
                        id="secondVerif"
                        name="secondVerif"
                      />
                    </View>

                    <View>
                      <BrandText
                        style={{
                          fontSize: 12,
                          color: "white",
                          marginRight: 209,
                        }}
                      >
                        I confirm that I do not fall under any of these
                        eclusions
                      </BrandText>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    left: 250,
                  }}
                >
                  <PrimaryButton
                    disabled={!(firstVerif && secondVerif)}
                    size="M"
                    text="ENTER THE DAPP"
                    style={{}}
                    onPress={onPressSubmitButton}
                  />
                </View>
              </View>
            </>
          }
        >
          <TextDisclaimer />
        </ModalDisclaimer>
      </View>
    </>
  );
}
