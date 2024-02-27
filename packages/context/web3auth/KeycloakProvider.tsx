import { bech32 } from "bech32";
import Keycloak from "keycloak-js";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { z } from "zod";

import useSelectedWallet from "@/hooks/useSelectedWallet";
import { useAppDispatch } from "@/store/store";

type KeycloakContextValue = {
  authenticated: boolean;
  ready: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  token: string | undefined;
  disabled: boolean;
};

const KeycloakContext = createContext<KeycloakContextValue>({
  authenticated: false,
  ready: false,
  login: async () => {
    throw new Error("KeycloakProvider not initialized");
  },
  logout: async () => {
    throw new Error("KeycloakProvider not initialized");
  },
  token: undefined,
  disabled: false,
});

export const useKeycloak = () => useContext(KeycloakContext);

export const KeycloakProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] = useState<Keycloak>();
  const [authenticated, setAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const selectedWallet = useSelectedWallet();
  const dispatch = useAppDispatch();
  const [token, setToken] = useState<string>();

  const login = useCallback(async () => {
    if (!provider) {
      throw new Error("KeycloakProvider not initialized");
    }
    await provider.login({ idpHint: "oidc" });
  }, [provider]);

  const logout = useCallback(async () => {
    if (!provider) {
      throw new Error("KeycloakProvider not initialized");
    }
    await provider.logout();
  }, [provider]);

  useEffect(() => {
    console.log(
      "KeycloakProvider: effect",
      selectedWallet,
      process.env.EXPO_PUBLIC_KEYCLOAK_URL,
      process.env.EXPO_PUBLIC_KEYCLOAK_REALM,
      process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
    );
    const effect = async () => {
      try {
        setReady(false);
        setDisabled(false);
        setProvider(undefined);
        setToken(undefined);
        setAuthenticated(false);
        if (
          !process.env.EXPO_PUBLIC_KEYCLOAK_URL ||
          !process.env.EXPO_PUBLIC_KEYCLOAK_REALM ||
          !process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID
        ) {
          throw new Error("KeycloakProvider not configured");
        }
        if (!selectedWallet) {
          throw new Error("KeycloakProvider no selected wallet");
        }
        const keycloak = new Keycloak({
          url: process.env.EXPO_PUBLIC_KEYCLOAK_URL,
          realm: process.env.EXPO_PUBLIC_KEYCLOAK_REALM,
          clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
        });
        console.log("keycloak created", keycloak);
        const authenticated = await keycloak.init({
          checkLoginIframe: false, // no idea what I'm doing
          enableLogging: true,
          pkceMethod: "S256",
          onLoad: "check-sso",
        });
        console.log(
          "keycloak initialized",
          keycloak,
          authenticated,
          keycloak.token && "has token",
          keycloak.refreshToken && "has refresh token",
          keycloak.idToken && "has id token",
        );
        if (authenticated) {
          await keycloak.loadUserInfo();
          const userInfo = z
            .object({
              "cosmos-universal-address": z.string(),
            })
            .parse(keycloak.userInfo);
          console.log("keycloak userInfo", userInfo);
          console.log("keycloak selectedWallet", selectedWallet);
          const universalAddress = userInfo["cosmos-universal-address"];
          const currentDecoded = bech32.decode(selectedWallet.address);
          if (
            bech32.encode("user", currentDecoded.words) !== universalAddress
          ) {
            await keycloak.logout();
            throw new Error("keycloak invalid address");
          }
          console.log("keycloak match");
          keycloak.onTokenExpired = () => {
            console.log("keycloak token expired");
            keycloak
              .updateToken(30)
              .then(() => {
                setToken(keycloak.token);
                console.log(
                  "keycloak successfully get a new token",
                  keycloak.token,
                );
              })
              .catch((err) => {
                console.error("keycloak failed to get a new token", err);
                setToken(undefined);
                setAuthenticated(false);
              });
          };

          setProvider(keycloak);
          setToken(keycloak.token);
          setAuthenticated(authenticated);
          setReady(true);
        } else {
          setProvider(keycloak);
          setAuthenticated(false);
          setToken(undefined);
          console.log("keycloak not authenticated");
          setReady(true);
        }
      } catch (e) {
        console.error("Failed to initialize keycloak client", e);
        setAuthenticated(false);
        setToken(undefined);
        setDisabled(true);
        setReady(true);
      }
    };
    effect();
  }, [dispatch, selectedWallet]);

  const value = useMemo(
    () => ({ authenticated, ready, login, logout, provider, token, disabled }),
    [authenticated, ready, login, logout, provider, token, disabled],
  );

  return (
    <KeycloakContext.Provider value={value}>
      {children}
    </KeycloakContext.Provider>
  );
};
