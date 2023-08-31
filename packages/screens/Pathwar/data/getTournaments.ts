import { Tournament } from "../../../api/pathwar/v1/pathwar";

export const getTournaments = () =>
  [
    {
      id: 1,
      price: {
        denom: "utori",
        amount: "10000000000",
      },
      thumbnail: "",
      title: "Wild Top 50",
      description: "description of the tournament",
      tagline: "reserved for the best",
      difficulty: "Hard+",
      status: 0,
      duration: "3 days",
      numUsersJoined: 30,
      rewards: [
        {
          denom: "utori",
          amount: "10000000000",
        },
      ],
      bought: true,
    },
    {
      id: 1,
      price: {
        denom: "utori",
        amount: "10000000000",
      },
      thumbnail: "",
      title: "Summer hacking event",
      description: "description of the tournament",
      tagline: "reserved for the best",
      difficulty: "Easy",
      status: 1,
      duration: "2 hours",
      numUsersJoined: 301,
      rewards: [],
      bought: true,
    },
  ] as Tournament[];
