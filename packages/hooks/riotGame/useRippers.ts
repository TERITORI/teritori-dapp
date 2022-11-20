const defaultGuardianNFTPNG = require('../../../assets/default-images/default-guardian-nft.png');


// TODO: change to real data from blockchains
const fakeRippers = [{
    id: 1,
    name: 'The r!ot #333',
    image: defaultGuardianNFTPNG,
    stamina: 1,
    protection: 1,
    luck: 1,
},
{
    id: 2,
    name: 'The r!ot #3343',
    image: defaultGuardianNFTPNG,
    stamina: 32,
    protection: 15,
    luck: 54,
},
{
    id: 3,
    name: 'The r!ot #143',
    image: defaultGuardianNFTPNG,
    stamina: 43,
    protection: 1,
    luck: 65,
}

];

const useRippers = () => {
    return {
        myRippers: fakeRippers,
        selectedRippers: []
    }
}

export default useRippers;