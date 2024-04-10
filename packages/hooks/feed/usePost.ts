import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import { Post } from "@/api/feed/v1/feed";
import { nonSigningSocialFeedClient } from "@/client-creators/socialFeedClient";
import { NetworkKind, getUserId, parseNetworkObjectId } from "@/networks";
import { decodeGnoPost } from "@/utils/feed/gno";
import { extractGnoJSONString } from "@/utils/gno";
import { safeParseJSON, zodTryParseJSON } from "@/utils/sanitize";
import { zodSocialFeedCommonMetadata } from "@/utils/types/feed";

export const usePost = (id: string | undefined) => {
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

      if (network?.kind === NetworkKind.Gno) {
        const provider = new GnoJSONRPCProvider(network.endpoint);
        const output = await provider.evaluateExpression(
          network.socialFeedsPkgPath || "",
          `GetPost(1, ${localIdentifier})`,
        );

        const gnoPost = extractGnoJSONString(output);
        return decodeGnoPost(network.id, gnoPost);
      } else {
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
          tipAmount: res.tip_amount,
          premiumLevel: commonMetadata?.premium || 0,
        };
        return post;
      }
    },
    { enabled: !!id },
  );
  return { post: data, ...other };
};
