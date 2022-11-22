const defaultGuardianNFTPNG = require("../../../assets/default-images/default-guardian-nft.png");

// TODO: change to real data from blockchains
const fakeRippers = [
  {
    id: 333,
    name: "The r!ot #333",
    image: defaultGuardianNFTPNG,
    stamina: 1,
    protection: 1,
    luck: 1,
  },
  {
    id: 3343,
    name: "The r!ot #3343",
    image: defaultGuardianNFTPNG,
    stamina: 32,
    protection: 15,
    luck: 54,
  },
  {
    id: 143,
    name: "The r!ot #143",
    image: defaultGuardianNFTPNG,
    stamina: 43,
    protection: 1,
    luck: 65,
  },
  {
    id: 1909,
    name: "The r!ot #1909",
    image: defaultGuardianNFTPNG,
    stamina: 43,
    protection: 1,
    luck: 65,
  },
  {
    id: 109,
    name: "The r!ot #109",
    image: defaultGuardianNFTPNG,
    stamina: 43,
    protection: 1,
    luck: 65,
  },
  {
    id: 19,
    name: "The r!ot #19",
    image: defaultGuardianNFTPNG,
    stamina: 43,
    protection: 1,
    luck: 65,
  },
];

const useRippers = () => {
  return {
    myRippers: fakeRippers,
    selectedRippers: [],
  };
};

export default useRippers;
