import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import { NetworkKind, parseUserId } from "../networks";

import { extractGnoString } from "@/utils/gno";

const DEFAULT_PROFILE: UserProfile = {
  displayName: "",
  bio: "",
  avatar: "",
};

type UserProfile = {
  displayName: string;
  bio: string;
  avatar: string;
};

export const useUserProfile = (userId: string | undefined) => {
  return useQuery(
    ["useUserProfile", userId],
    async (): Promise<UserProfile> => {
      const [network, address] = parseUserId(userId);
      if (!network || !address) {
        throw Error(`Unable to parse userId: ${userId}`);
      }

      switch (network.kind) {
        case NetworkKind.Gno:
          const provider = new GnoJSONRPCProvider(network?.endpoint);
          const { profilePkgPath } = network;
          if (!profilePkgPath) {
            throw Error("profilePkgPath is not given");
          }

          const profileFields = ["DisplayName", "Bio", "Avatar"];
          const promises = profileFields.map((field) =>
            provider.evaluateExpression(
              profilePkgPath,
              `GetStringField("${address}","${field}","")`,
            ),
          );

          const dataRaw = await Promise.all(promises);
          const extractedData = dataRaw.map(extractGnoString);

          const profile: UserProfile = {
            displayName: extractedData[0],
            bio: extractedData[1],
            avatar: extractedData[2],
          };

          return profile;
        default:
          return DEFAULT_PROFILE;
      }
    },
  );
};
