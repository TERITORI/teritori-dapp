import {
  Challenge,
  ChallengeStatus,
  Money,
} from "../../api/pathwar/v1/pathwar";

export const getChallenges = () => {
  return [
    {
      id: 123,
      price: {
        denom: "utori",
        amount: "1000000000",
      } as Money,
      thumbnail:
        "ipfs%3A%2F%2Fbafybeic3r3pcxubbx5pg6vzmq7wniamxviflxfc4gstk743747viqeo67i%2Fnft.png",
      title: "title",
      tagline: "tagline",
      description: "aoeuaoe",
      difficulty: "Hard+",
      status: ChallengeStatus.OPEN,
      duration: "3 days",
      numUsersJoined: 3,
      rewards: [
        {
          denom: "utori",
          amount: "100000000",
        },
      ],
      bought: true,
      tags: [
        {
          id: 1,
          text: "tag",
        },
        {
          id: 2,
          text: "tag 2",
        },
      ],
      starUser: {
        address: "tori-tori1c2t58ydw6ww7ukrm66xu67y2hmz66dermqax99",
      },
      topUsers: [
        {
          address: "tori-tori1c2t58ydw6ww7ukrm66xu67y2hmz66dermqax99",
        },
        {
          address: "tori-tori1c2t58ydw6ww7ukrm66xu67y2hmz66dermqax99",
        },
      ],
      solved: false,
    },
  ] as Challenge[];
};
