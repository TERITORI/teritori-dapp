import { View } from "react-native";

import { Background } from "../components/background/Background";
import { MenuLink } from "../components/menu-link/MenuLink";
import { useContentContext } from "../context/ContentProvider";
import { Login } from "./Login";
import { Main } from "./Main";

export const Content = () => {
  const { selectedSection } = useContentContext();

  const Section = () => {
    if (selectedSection === "login") return <Login />;
    if (selectedSection === "main") return <Main />;
    // if (selectedSection === "raffle") return <Main />;
    // if (selectedSection === "comicgood") return <Main />;
  };

  return (
    <Background type={selectedSection}>
      <>
        {selectedSection !== "login" && <MenuLink />}
        <View
          style={{
            flexDirection: "column",
            flexWrap: "wrap",
            justifyContent: "center",
            alignContent: "center",
            height: "35em",
          }}
        >
          {Section()}
        </View>
      </>
    </Background>
  );
};
