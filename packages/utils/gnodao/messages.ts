export type GnoExecutableMessage = object;

export interface GnoSingleChoiceProposal {
  title: string;
  description: string;
  messages: GnoExecutableMessage[];
}

export interface GnoDAOUpdateSettings {
  type: "gno.land/p/demo/daodao/proposal_single.UpdateSettings";
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
  type: "gno.land/r/demo/tori.Mint";
  payload: {
    amount: number;
    address: string;
  };
}

export interface GnoModboardsDeletePostMessage {
  type: "gno.land/r/demo/modboards.DeletePost";
  payload: {
    boardId: number;
    threadId: number;
    postId: number;
    reason: string;
  };
}

export interface GnoModboardsCreateMessage {
  type: "gno.land/r/demo/modboards.CreateBoard";
  payload: {
    name: string;
  };
}
