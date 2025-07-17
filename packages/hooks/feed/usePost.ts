import { fromJson } from "@bufbuild/protobuf";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import useSelectedWallet from "../useSelectedWallet";

import { Post } from "@/api/feed/v1/feed";
import { PostViewJson, PostViewSchema } from "@/api/feeds/v1/feeds_pb";
import { nonSigningSocialFeedClient } from "@/client-creators/socialFeedClient";
import { NetworkKind, getUserId, parseNetworkObjectId } from "@/networks";
import { gnoZenaoNetwork } from "@/networks/gno-zenao";
import { decodeGnoPost } from "@/utils/feed/gno";
import { extractGnoJSONResponse, extractGnoJSONString } from "@/utils/gno";
import { safeParseJSON, zodTryParseJSON } from "@/utils/sanitize";
import { zodSocialFeedCommonMetadata } from "@/utils/types/feed";
import { postViewToPost } from "@/utils/zenao";

export const usePost = (id: string | undefined) => {
  const wallet = useSelectedWallet();

  const { data, ...other } = useQuery<Post | null>(
    ["social-post", id],
    async () => {
      if (!id) {
        return null;
      }
      const [network, localIdentifier] = parseNetworkObjectId(id);
      if (!network) {
        return null;
      }
      // Gno Zenao network
      else if (
        network?.kind === NetworkKind.Gno &&
        network?.id === gnoZenaoNetwork.id
      ) {
        const callerAddress = wallet?.address || "";
        const provider = new GnoJSONRPCProvider(network.endpoint);

        const output = await provider.evaluateExpression(
          network.socialFeedsPkgPath || "",
          `postViewToJSON(GetPostView(${localIdentifier}, "${callerAddress}"))`,
        );
        const raw = extractGnoJSONResponse(output);
        const postView = fromJson(PostViewSchema, raw as PostViewJson);
        return postViewToPost(postView);
      }
      // Gno network
      else if (network?.kind === NetworkKind.Gno) {
        const provider = new GnoJSONRPCProvider(network.endpoint);
        const output = await provider.evaluateExpression(
          network.socialFeedsPkgPath || "",
          `GetPost(1, ${localIdentifier})`,
        );

        const gnoPost = extractGnoJSONString(output);
        return decodeGnoPost(network.id, gnoPost);
      }
      // Other networks (e.g., Cosmos)
      else {
        const client = await nonSigningSocialFeedClient({
          networkId: network.id,
        });
        const res = await client.queryPost({ identifier: localIdentifier });

        // try to get date from metadata
        // FIXME: fix social feed contract and remove this
        // we should not trust the client to put correct date
        let createdAt = 0;
        const metadata = safeParseJSON(res.metadata);
        if (
          typeof metadata === "object" &&
          metadata !== null &&
          "createdAt" in metadata &&
          typeof metadata.createdAt === "string"
        ) {
          createdAt = moment(metadata.createdAt).unix();
        }

        const commonMetadata = zodTryParseJSON(
          zodSocialFeedCommonMetadata,
          res.metadata,
        );

        const post: Post = {
          id,
          networkId: network.id,
          identifier: localIdentifier,
          localIdentifier,
          parentPostIdentifier: res.parent_post_identifier || "",
          category: res.category,
          metadata: res.metadata,
          reactions: res.reactions,
          authorId: getUserId(network.id, res.post_by),
          isDeleted: res.deleted,
          subPostLength: res.sub_post_length,
          createdAt,
          tipAmount: parseFloat(res.tip_amount),
          premiumLevel: commonMetadata?.premium || 0,
        };
        return post;
      }
    },
    { enabled: !!id },
  );
  return { post: data, ...other };
};
