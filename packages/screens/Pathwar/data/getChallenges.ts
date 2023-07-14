import { Challenge, Status, Money } from "../../../api/pathwar/v1/pathwar";

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
      title: "Cosmos Hacking 3-1",
      tagline: "Continue with phase 2",
      description: "Intermediate to experts",
      difficulty: "Hard+",
      status: Status.STATUS_OPEN_UNSPECIFIED,
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
        {
          id: 1,
          text: "tag",
        },
        {
          id: 2,
          text: "tag 2",
        },
        {
          id: 1,
          text: "tag",
        },
        {
          id: 2,
          text: "tag 2",
        },
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
        address: "tori-tori1q3cy3znau0gzulws23zhn6c0g6h3wlwmhfttpe",
      },
      topUsers: [
        {
          address: "tori-tori1qt9nr2m65yd907d4j9unsla5cnrmwlp9dazc77",
        },
        {
          address: "tori-tori1c2t58ydw6ww7ukrm66xu67y2hmz66dermqax99",
        },
        {
          address: "tori-tori14fnlzk36kvtkgajyq60gp7wpfxa900kkc6v65g",
        },
        {
          address: "tori-tori1q3cy3znau0gzulws23zhn6c0g6h3wlwmhfttpe",
        },
        {
          address: "tori-tori1vm8fy28ntwsalqf6gmguqf6qx8qtkwgcae7g9c",
        },
        {
          address: "tori-tori14grryrkwtf0ugtlthrnr59ktztc9mnfch5x2dg",
        },
      ],
      solved: false,
      solvedCount: 16,
    },
    {
      id: 123,
      price: {
        denom: "utori",
        amount: "1000000000",
      } as Money,
      thumbnail:
        "ipfs%3A%2F%2Fbafybeic3r3pcxubbx5pg6vzmq7wniamxviflxfc4gstk743747viqeo67i%2Fnft.png",
      title: "Wi-Fi Security Principles",
      tagline: "WEP is broken",
      description: "Easy but not beginners",
      difficulty: "Easy",
      status: Status.STATUS_OPEN_UNSPECIFIED,
      duration: "3 days",
      numUsersJoined: 3,
      rewards: [
        {
          denom: "utori",
          amount: "500000000",
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
          address: "tori-tori14fnlzk36kvtkgajyq60gp7wpfxa900kkc6v65g",
        },
        {
          address: "tori-tori1q3cy3znau0gzulws23zhn6c0g6h3wlwmhfttpe",
        },
        {
          address: "tori-tori1vm8fy28ntwsalqf6gmguqf6qx8qtkwgcae7g9c",
        },
        {
          address: "tori-tori14grryrkwtf0ugtlthrnr59ktztc9mnfch5x2dg",
        },
        {
          address: "tori-tori1qt9nr2m65yd907d4j9unsla5cnrmwlp9dazc77",
        },
      ],
      solved: false,
      solvedCount: 160,
    },
  ] as Challenge[];
};
