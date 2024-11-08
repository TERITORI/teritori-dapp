type GnoExecutableMessage = object;

export interface GnoSingleChoiceProposal {
  title: string;
  description: string;
  messages: GnoExecutableMessage[];
}

export interface GnoDAOVoteRequest {
  vote: string;
  rationale: string;
}

export interface GnoDAOUpdateSettings {
  type: "gno.land/p/teritori/dao_proposal_single.UpdateSettings";
  payload: {
    threshold: {
      thresholdQuorum: {
        threshold: {
          percent: number;
        };
        quorum: {
          percent: number;
        };
      };
    };
  };
}

export interface GnoMintToriMessage {
  type: "gno.land/r/teritori/tori.Mint";
  payload: {
    amount: number;
    address: string;
  };
}

export interface GnoModboardsDeletePostMessage {
  type: "gno.land/r/teritori/modboards.DeletePost";
  payload: {
    boardId: number;
    threadId: number;
    postId: number;
    reason: string;
  };
}

export interface GnoModboardsCreateMessage {
  type: "gno.land/r/teritori/modboards.CreateBoard";
  payload: {
    name: string;
  };
}

export interface GnoBanPostMessage {
  type: "gno.land/r/teritori/social_feeds.BanPost";
  payload: {
    feedId: number;
    postId: number;
    reason: string;
  };
}

export interface GnoCreatePostMessage {
  type: "gno.land/r/teritori/social_feeds.CreatePost";
  payload: {
    feedId: string;
    parentId: string;
    category: string;
    metadata: string;
  };
}

export interface GnoAddMemberMessage {
  type: "gno.land/r/teritori/groups.AddMember";
  payload: {
    groupId: number;
    address: string;
    weight: number;
    metadata: string;
  };
}
