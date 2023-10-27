### This doc resumes the needed steps to do when deploying P2E ETH

#### Remainning work to do for testnet
1. Wait Dubiella FE to merge
2. Prepare/run k8s task to run the indexer/leaderboard updated. Should test the compatibility with Teritori Cosmos
3. Clean DB, run indexer/backend/leaderboard

### Todo for mainnet
1. Deploy all related contracts
2. Fill needed contracts addresses in substream env to generate the correct wasm for polygon and Adjust the timestamp to begin the indexer for poygon
3. Generate wasm for poygon and put in dapp, update the network package
4. Prepare k8, deploy mainnet
