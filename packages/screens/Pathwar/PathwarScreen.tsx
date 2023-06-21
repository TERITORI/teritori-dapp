import React, { useState, useEffect } from "react";
import { View, Image } from "react-native";

import pathwarBanner from "../../../assets/banners/pathwarBanner.png";
import searchIcon from "../../../assets/icons/Pathwar/searchIcon.svg";
import { BrandText } from "../../components/BrandText";
import { ChallengeBox } from "../../components/Pathwar/ChallengeBox";
import { ConnectBar } from "../../components/Pathwar/ConnectBar";
import { NavBarPathwarOverview } from "../../components/Pathwar/NavbarOverview/NavBarPathwarOverview";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import { ScreenFC } from "../../utils/navigation";
import { neutral00 } from "../../utils/style/colors";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const PathwarScreen: ScreenFC<"Pathwar"> = () => {
  const [search, setSearch] = useState("");

  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDck10ZmN1cjFDcVNtT28teHZacUt0ZTRoODk4ZjZpYl9KOGk5TXZDck5zIn0.eyJqdGkiOiJjMDZhMmZkOC03NmYxLTQzYzMtYmNkYi0xZjg0ZmJmNjhlY2MiLCJleHAiOjE2NjY4MTk1NzMsIm5iZiI6MCwiaWF0IjoxNjY2ODE5MjczLCJpc3MiOiJodHRwczovL2lkLnBhdGh3YXIubGFuZC9hdXRoL3JlYWxtcy9QYXRod2FyLURldiIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJiMmUzZDYzMy1kZDVjLTQ3YWQtYTA2Yy03YmU1ZjliNjBhN2EiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJwbGF0Zm9ybS1mcm9udCIsIm5vbmNlIjoiNTBkYjkyNzUtNTM3NC00YjBlLTgyOTItZDFkODkxMTIwNDBkIiwiYXV0aF90aW1lIjoxNjY2ODE5MjYxLCJzZXNzaW9uX3N0YXRlIjoiNDc2ZjE4ZGItMDdkMC00NDZjLTg4ODEtNDljMTZlMDU4N2Y4IiwiYWNyIjoiMCIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoieCB4IiwicHJlZmVycmVkX3VzZXJuYW1lIjoicmVkYWRldi0xNyIsImdpdmVuX25hbWUiOiJ4IiwiZmFtaWx5X25hbWUiOiJ4IiwiZW1haWwiOiJyZWRhLmJlcmJpY2hlMTdAZ21haWwuY29tIn0.FPHVx-Tu8dlppyciPI595EZR8ByCVyWTnoxSL32H7SjdwWX2RIpojp-klBTPjNOEEQyxvY8al_gyZe8U3yXOide0GEswGpNJeSeU0pqiHuC4f9BdhCbIdghxClHcnQi9tE6V2JEAnrIIibIyHE-bdUX4Wq4tY6WiK5i5o58bb97P9TS-7HDfvonr5iQDO7DoFQMli-vI7MDWwvR-hdaJj4FXJwttiutl4OYmjdo9qU851m0xk-EKLwly-_xOMZEurTApvJmFn9Q-AO8zvvwKbrLw4VHlVPccPqycxAZYZlrHKeHGn_RvUfTUc-axQ0b9500P6TBGXKiGfcxZUwJmEg"
    );

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    const fetchData = async () => {
      const res = await fetch(
        "https://api-unsafe.pathwar.land/season-challenges?season_id=1491161252464955392",
        requestOptions
      );
      const data = await res.json();

      setCards(data.items);
    };
    fetchData().catch(console.error);
  }, []);

  return (
    <ScreenContainer>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          margin: "auto",
        }}
      >
        <Image
          source={pathwarBanner}
          style={{
            width: "100%",
            height: 400,
          }}
        />
      </View>
      <View style={{ marginTop: layout.padding_x2_5 }}>
        <ConnectBar />
      </View>
      <NavBarPathwarOverview />

      <Separator
        style={{
          marginTop: layout.padding_x2_5,
          marginBottom: layout.padding_x3_5,
        }}
      />

      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          marginBottom: layout.padding_x4,
        }}
      >
        <BrandText style={fontSemibold28}>Challenges</BrandText>
        <View style={{ marginTop: layout.padding_x3_5 }}>
          <TextInputCustom<{ Search: string }>
            label=""
            name="Search"
            width={400}
            placeHolder="Search..."
            squaresBackgroundColor={neutral00}
            onChangeText={setSearch}
          >
            <View style={{ marginRight: layout.padding_x0_5 }}>
              <SVG source={searchIcon} />
            </View>
          </TextInputCustom>
        </View>
      </View>

      <View
        style={{
          width: 1320,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        {cards.map((item, index) => {
          if (
            item.flavor.challenge.name
              .toLowerCase()
              .includes(search.toLowerCase())
          ) {
            return (
              <ChallengeBox
                key={index}
                title={item.flavor.challenge.name}
                description={item.flavor.body}
                tags={item.flavor.tags}
                price={item.flavor.purchase_price}
                reward={item.flavor.validation_reward}
                indexPicture={index}
              />
            );
          }
        })}
      </View>
    </ScreenContainer>
  );
};
