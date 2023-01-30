## Generate contract clients for EVM

- Clone the repo `https://github.com/TERITORI/evm-nft-vault`
- Set the needed hardhat environment 
- Compiles the contracts with: `npx hardhat compile`
- Copy the needed generated files, ex: If the contract name is `TeritoriNft` then we need to:
    + copy `types/factories/<TeritoriNft__factory.ts` => `packages/evm-contracts-clients/teritori-nft` 
    + copy `types/<TeritoriNft.d.ts` => `packages/evm-contracts-clients/teritori-nft` 
- Adjust the import:
    + `import type { TeritoriNft, TeritoriNftInterface } from "../TeritoriNft";` => `import type { TeritoriNft, TeritoriNftInterface } from "./TeritoriNft";`
    + `import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";` => `import type { TypedEventFilter, TypedEvent, TypedListener } from "../common";`