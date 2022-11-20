const defaultGuardianNFTPNG = require('../../../assets/default-images/default-guardian-nft.png');


// TODO: change to real data from blockchains
const _fakeRipper = {
    id: 1,
    name: 'The r!ot #333',
    image: defaultGuardianNFTPNG,
    stamina: 1,
    protection: 1,
    luck: 1,
};

const fakeRippers: NSRiotGame.Ripper[] = Array(6).fill(_fakeRipper);


const useRippers = () => {
    return {
        myRippers: fakeRippers,
        selectedRippers: []
    }
}

export default useRippers;