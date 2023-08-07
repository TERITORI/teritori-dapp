import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import { nonSigningSocialFeedClient } from "../../client-creators/socialFeedClient";
import { GNO_SOCIAL_FEEDS_PKG_PATH } from "../../components/socialFeed/const";
import { decodeGnoPost } from "../../components/socialFeed/utils";
import { NetworkKind, getNetwork } from "../../networks";
import { extractGnoString } from "../../utils/gno";

export const usePost = (id: string, networkId: string) => {
  const { data, ...other } = useQuery(
    ["social-post", id, networkId],
    async () => {
      const network = getNetwork(networkId);

      if (network?.kind === NetworkKind.Gno) {
        const provider = new GnoJSONRPCProvider(network.endpoint);
        const output = await provider.evaluateExpression(
          GNO_SOCIAL_FEEDS_PKG_PATH,
          `GetPost(1, ${id})`
        );

        const postData = extractGnoString(output);
        const post = decodeGnoPost(network.id, postData);

        return {
          identifier: id,
          parent_post_identifier: post.parentPostIdentifier, // identifier of linked post
          category: post.category, // PostCategory
          metadata: post.metadata,
          reactions: post.reactions,
          user_reactions: [], // TODO: What this for ?
          post_by: post.createdBy,
          deleted: post.isDeleted,
          sub_post_length: 0, // TODO: handle this
        };
      } else {
        const client = await nonSigningSocialFeedClient({
          networkId,
        });
        return await client.queryPost({ identifier: id });
      }
    }
  );
  return { post: data, ...other };
};
