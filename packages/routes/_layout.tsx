import { Drawer } from "expo-router/drawer";
import React from "react";
import { Platform } from "react-native";

import "../../App";
import Root from "../../Root";
import { Sidebar } from "../components/navigation/Sidebar";
import { neutral00 } from "../utils/style/colors";
import { fullSidebarWidth } from "../utils/style/layout";

const getNav = () => {
  return {
    Nav: Drawer,
    navigatorScreenOptions: {
      drawerStyle: {
        backgroundColor: neutral00,
        width: fullSidebarWidth,
      },
    },
  };
};

const { Nav, navigatorScreenOptions } = getNav();

const screenTitle = (title: string) => "Teritori - " + title;

export default () => {
  return (
    <Root>
      <Nav
        initialRouteName="index"
        drawerContent={() => (Platform.OS === "web" ? null : <Sidebar />)}
        screenOptions={navigatorScreenOptions as any} // FIXME: upgrade to expo-router
      >
        <Nav.Screen
          name="index"
          options={{ header: () => null, title: screenTitle("Home") }}
        />
        <Nav.Screen
          name="my-collection"
          options={{ header: () => null, title: screenTitle("My Collection") }}
        />
        <Nav.Screen
          name="guardians"
          options={{ header: () => null, title: screenTitle("Guardians") }}
        />
        <Nav.Screen name="riot-game/index" options={{ header: () => null }} />

        <Nav.Screen
          name="marketplace"
          options={{
            header: () => null,
            title: screenTitle("NFT Marketplace - Popular Collections"),
          }}
        />
        <Nav.Screen
          name="governance"
          options={{ header: () => null, title: screenTitle("Governance") }}
        />
        <Nav.Screen name="UserPublicProfile" options={{ header: () => null }} />
        <Nav.Screen
          name="rioters-footer"
          options={{ header: () => null, title: screenTitle("Rioters Footer") }}
        />

        {/* === Riot Game */}
        <Nav.Screen
          name="riot-game/enroll"
          options={{
            header: () => null,
            title: screenTitle("Riot Game Enroll"),
          }}
        />
        <Nav.Screen
          name="riot-game/fight"
          options={{
            header: () => null,
            title: screenTitle("Riot Game Fight"),
          }}
        />
        <Nav.Screen
          name="riot-game/breeding"
          options={{
            header: () => null,
            title: screenTitle("Riot Game Breeding"),
          }}
        />
        <Nav.Screen
          name="riot-game/marketplace"
          options={{
            header: () => null,
            title: screenTitle("Riot Game Marketplace"),
          }}
        />
        <Nav.Screen
          name="riot-game/memories"
          options={{
            header: () => null,
            title: screenTitle("Riot Game Memories"),
          }}
        />
        <Nav.Screen
          name="riot-game/leaderboard"
          options={{
            header: () => null,
            title: screenTitle("Riot Game Leaderboard"),
          }}
        />
        <Nav.Screen
          name="riot-game/inventory"
          options={{
            header: () => null,
            title: screenTitle("Riot Game Inventory"),
          }}
        />

        {/* ==== Wallet Manager */}
        <Nav.Screen
          name="wallet-manager/index"
          options={{ header: () => null, title: screenTitle("Wallet Manager") }}
        />
        <Nav.Screen
          name="wallet-manager/wallets"
          options={{
            header: () => null,
            title: screenTitle("Wallet Manager (Wallets)"),
          }}
        />
        <Nav.Screen
          name="wallet-manager/chains"
          options={{
            header: () => null,
            title: screenTitle("Wallet Manager (Chains)"),
          }}
        />

        {/* ==== Launchpad */}
        <Nav.Screen
          name="launchpad/index"
          options={{ header: () => null, title: screenTitle("Launchpad") }}
        />
        <Nav.Screen
          name="launchpad/apply"
          options={{
            header: () => null,
            title: screenTitle("Launchpad (Apply)"),
          }}
        />
        <Nav.Screen
          name="collection/[id]/mint"
          options={{
            header: () => null,
            title: screenTitle("Mint Collection"),
          }}
        />

        {/* ==== Multisig */}
        <Nav.Screen
          name="multisig/index"
          options={{
            header: () => null,
            title: screenTitle("Multisig Wallets"),
          }}
        />
        <Nav.Screen
          name="multisig/create"
          options={{
            header: () => null,
            title: screenTitle("Create Multisig Wallet"),
          }}
        />
        <Nav.Screen
          name="multisig/[id]"
          options={{
            header: () => null,
            title: screenTitle("Multisig Wallet Dashboard"),
          }}
        />

        {/* ==== Organization */}

        <Nav.Screen
          name="create-org"
          options={{
            header: () => null,
            title: screenTitle("Organization Deployer"),
          }}
        />
        <Nav.Screen
          name="orgs"
          options={{
            header: () => null,
            title: screenTitle("Organizations"),
          }}
        />

        {/* ==== Teritori Name Service*/}
        <Nav.Screen
          name="tns/index"
          options={{ header: () => null, title: screenTitle("Name Service") }}
        />
        <Nav.Screen
          name="tns/[modal]"
          options={{ header: () => null, title: screenTitle("Name Service") }}
        />
        <Nav.Screen
          name="collection/[id]/index"
          options={{ header: () => null, title: screenTitle("Collection") }}
        />
        <Nav.Screen
          name="nft/:id"
          options={{ header: () => null, title: screenTitle("NFT") }}
        />
        <Nav.Screen
          name="staking"
          options={{ header: () => null, title: screenTitle("Staking") }}
        />
        {/* ==== Swap*/}
        <Nav.Screen
          name="swap"
          options={{ header: () => null, title: screenTitle("Swap") }}
        />
        <Nav.Screen name="coming-soon" options={{ header: () => null }} />
        <Nav.Screen
          name="collection/[id]/tools"
          options={{ header: () => null }}
        />
        <Nav.Screen name="settings" options={{ header: () => null }} />
        <Nav.Screen
          name="feed/new"
          options={{ header: () => null, title: screenTitle("New Article") }}
        />

        <Nav.Screen
          name="feed/post/[id]"
          options={{ header: () => null, title: "Teritori" }}
        />
        <Nav.Screen
          name="feed/index"
          options={{ header: () => null, title: screenTitle("Feed") }}
        />
        <Nav.Screen
          name="feed/[tab]"
          options={{ header: () => null, title: screenTitle("Feed") }}
        />
        <Nav.Screen
          name="feed/tag/[hashtag]"
          options={{ header: () => null, title: screenTitle("") }}
        />
        <Nav.Screen
          name="dapp/tori-punks/[route]"
          options={{ header: () => null, title: screenTitle("ToriPunks") }}
        />
        <Nav.Screen
          name="dapp-store"
          options={{ header: () => null, title: screenTitle("dApp Store") }}
        />
        <Nav.Screen
          name="core-dao"
          options={{ header: () => null, title: screenTitle("Core DAO") }}
        />
        <Nav.Screen
          name="stats"
          options={{ header: () => null, title: screenTitle("Metrics") }}
        />
        <Nav.Screen
          name="message/index"
          options={{ header: () => null, title: screenTitle("Message") }}
        />
        <Nav.Screen
          name="message/[view]"
          options={{ header: () => null, title: screenTitle("Message") }}
        />
        <Nav.Screen
          name="message/chat"
          options={{
            header: () => null,
            title: screenTitle("Chat Message"),
          }}
        />
        <Nav.Screen
          name="message/friends"
          options={{
            header: () => null,
            title: screenTitle("Friends Add"),
          }}
        />
      </Nav>
    </Root>
  );
};
