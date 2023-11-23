import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import { Post } from "../../api/feed/v1/feed";
import { nonSigningSocialFeedClient } from "../../client-creators/socialFeedClient";
import { decodeGnoPost } from "../../components/socialFeed/utils";
import { NetworkKind, getNetwork, getUserId } from "../../networks";
import { extractGnoJSONString } from "../../utils/gno";
import { safeParseJSON } from "../../utils/sanitize";

// FIXME: this is not typed
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
          `GetPost(1, ${id})`,
        );

        const gnoPost = extractGnoJSONString(output);
        return decodeGnoPost(networkId, gnoPost);
      } else {
        const client = await nonSigningSocialFeedClient({
          networkId,
        });
        const res = await client.queryPost({ identifier: id });

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

        const post: Post = {
          identifier: id,
          parentPostIdentifier: res.parent_post_identifier || "",
          category: res.category,
          metadata: res.metadata,
          reactions: res.reactions,
          authorId: getUserId(networkId, res.post_by),
          isDeleted: res.deleted,
          subPostLength: res.sub_post_length,
          createdAt,
          tipAmount: res.tip_amount,
        };
        return post;
      }
    },
    { enabled: !!networkId },
  );
  return { post: data, ...other };
};
