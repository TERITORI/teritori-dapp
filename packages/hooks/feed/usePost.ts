import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import { Post } from "../../api/feed/v1/feed";
import { nonSigningSocialFeedClient } from "../../client-creators/socialFeedClient";
import { decodeGnoPost } from "../../components/socialFeed/utils";
import { NetworkKind, getNetwork, getUserId } from "../../networks";
import { extractGnoJSONString } from "../../utils/gno";

export const usePost = (id: string, networkId: string | undefined) => {
  const { data, ...other } = useQuery<Post>(
    ["social-post", id, networkId],
    async () => {
      if (!networkId) {
        throw new Error("networkId is required");
      }

      const network = getNetwork(networkId);
      if (network?.kind === NetworkKind.Gno) {
        const provider = new GnoJSONRPCProvider(network.endpoint);
        const output = await provider.evaluateExpression(
          network.socialFeedsPkgPath || "",
          `GetPost(1, ${id})`
        );

        const gnoPost = extractGnoJSONString(output);
        return decodeGnoPost(networkId, gnoPost);
      } else {
        const client = await nonSigningSocialFeedClient({
          networkId,
        });
        const res = await client.queryPost({ identifier: id });

        const post: Post = {
          identifier: id,
          parentPostIdentifier: res.parent_post_identifier || "",
          category: res.category,
          metadata: res.metadata,
          reactions: res.reactions,
          authorId: getUserId(networkId, res.post_by),
          isDeleted: res.deleted,
          subPostLength: res.sub_post_length,
          createdAt: res.created_at,
          tipAmount: res.tip_amount,
        };
        return post;
      }
    },
    { enabled: !!networkId }
  );
  return { post: data, ...other };
};
