type GnoExecutableMessage = object;

export interface GnoSingleChoiceProposal {
  title: string;
  description: string;
  messages: GnoExecutableMessage[];
}

export interface GnoDAOVoteRequest {
  vote: number;
  rationale: string;
}

export interface GnoDAOUpdateSettings {
  type: "gno.land/p/demo/teritori/dao_proposal_single.UpdateSettings";
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
  type: "gno.land/r/demo/teritori/tori.Mint";
  payload: {
    amount: number;
    address: string;
  };
}

export interface GnoModboardsDeletePostMessage {
  type: "gno.land/r/demo/teritori/modboards.DeletePost";
  payload: {
    boardId: number;
    threadId: number;
    postId: number;
    reason: string;
  };
}

export interface GnoModboardsCreateMessage {
  type: "gno.land/r/demo/teritori/modboards.CreateBoard";
  payload: {
    name: string;
  };
}

export interface GnoBanPostMessage {
  type: "gno.land/r/demo/teritori/social_feeds.BanPost";
  payload: {
    feedId: number;
    postId: number;
    reason: string;
  };
}

export interface GnoAddMemberMessage {
  type: "gno.land/r/demo/teritori/groups.AddMember";
  payload: {
    groupId: number;
    address: string;
    weight: number;
    metadata: string;
  };
}
