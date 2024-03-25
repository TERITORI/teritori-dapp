# Contributing

## Contributor guidelines

### Core contributor loop

- Check the [list of PRs that need review](https://github.com/TERITORI/teritori-dapp/pulls?q=is%3Apr+is%3Aopen+review%3Arequired+draft%3Afalse+) and review relevant PRs, see [Reviewing a PR](#reviewing-a-pr)
- Check your [assigned PRs that require changes](https://github.com/TERITORI/teritori-dapp/pulls?q=is%3Apr+is%3Aopen+review%3Achanges_requested+draft%3Afalse+assignee%3A%40me+) and address the reviews
- Make sure you have self-reviewed your existing PRs and the CI passes on them, see [Reviewing a PR](#reviewing-a-pr)
- Continue on your assigned tasks
- If you have nothing to do at this point, ask for a new task

For all tasks, create a PR as soon as possible to make other mates aware of your work and to prevent you from going in a bad direction

### Creating a PR

- Make sure the PR's title follows [the conventional commits standard](https://www.conventionalcommits.org/en/v1.0.0/) as it will be used as the squashed commit title on main
- Make sure your are assigned to the PR, this helps you to know [which PRs require your attention](https://github.com/TERITORI/teritori-dapp/pulls?q=is%3Apr+is%3Aopen+assignee%3A%40me)
- Try to keep the PR [atomic](https://fagnerbrack.com/one-pull-request-one-concern-e84a27dfe9f1), it will be merged faster and benefit all your mates
- Self-review the changes and pass CI before asking for other peoples reviews, see [Reviewing a PR](#reviewing-a-pr)

### Reviewing a PR

- Read and understand all changes
  
  You can use the GitHub diff and mark each file as viewed, this will help in subsequent reviews as unchanged files will keep the "Viewed" status
  
  <img width="448" alt="Screenshot 2024-03-21 at 20 01 38" src="https://github.com/TERITORI/teritori-dapp/assets/7917064/6141fdd3-2746-498d-916f-9945a56c7ff0">

- Test
  
  Check that the feature works or the bug is fixed

  If there is changes in code used at other places, test for regressions in affected features

If the PR is not atomic enough and makes reviewing hard, you can ask the author to split it

You can deny the review if the PR does not pass CI

## Technology overview

### Web3 vs Web2

TODO

### Frontend

#### Language: Typescript

We use a strict [Typescript](https://www.typescriptlang.org/docs/handbook/intro.html) configuration and try to enforce type-safety. Typescript very easily allows to bypass it's type-safety mechanism so it requires some discipline from the developer.

#### Framework: Expo

We use [the Expo framework](https://docs.expo.dev/) to support Web, Android, iOS, Windows, Macos and Linux with the same codebase.
This uses [react-native](https://reactnative.dev/docs/getting-started) to support mobile and [react-native-web](https://necolas.github.io/react-native-web/docs/) for web. The desktop build uses electron and react-native-web.

If you are coming from React and you work with the web dev server, it's important to understand that using html components (eg `<div>`) and styles will work because the react-native-web renderer allows it but it won't work with native renderers (iOS, Android and native desktop). So please check the expo api reference to make sure you are using things that are truly cross-platform.

#### Data fetching: react-query

We use [react-query](https://tanstack.com/query/v4/docs/framework/react/overview) to fetch data. It provides call-deduplication and configurable caching.
You can use it for optimistic mutations too but in most mutations case an async callback is enough.

#### App state: redux

We use [redux](https://redux-toolkit.js.org/) for global app state, it supports persistence. We're considering switching to [zustand](https://github.com/pmndrs/zustand).

### Backend

#### Decentralized services: Cosmos SDK

The main service for the Teritori chain is the Teritori blockchain daemon, [teritorid](https://github.com/TERITORI/teritori-chain).
But a lot of features we're developing are cross-chain compatible and use common [Cosmos SDK](https://docs.cosmos.network/) APIs.
Cosmos blockchain are configurable and you can see the list of modules for the Teritori chain [here](https://github.com/TERITORI/teritori-chain/blob/v2.0.6/app/app.go#L210-L238) for example.

You can find the main Cosmos API documentation [here](https://docs.cosmos.network/api).

Cosmos provides a native way for inter-blockchain communication called [IBC](https://cosmos.network/ibc/). It allows to transfer currencies between chains and more complex cross-chain behavior, for example swapping funds on Osmosis from a DAO on Teritori while keeping funds sovereignty by the DAO.

#### Smart contracts: CosmWASM

Smart-contracts are programs that run on blockchains.

The smart-contracts on teritori chain and most cosmos chains are using [cosmwasm](https://book.cosmwasm.com/) and thus [rust](https://www.rust-lang.org/) as programing language.

We recommend to use the [sylvia framework](https://cosmwasm.github.io/sylvia-book/index.html) to write your cosmwasm contracts as it heavily reduces boilerplate, making the code easier to maintain and read. It also provides better testing utilities.

#### Indexer: golang + postgres + substreams

Some chain data need to be aggregated and indexed to allow for performant queries. For example the marketplace stats that is aggregating the trade amounts for a month or indexing all nfts for an user so we can efficiently show the owned nfts of an user.
The cosmos-targeted indexer uses a custom golang daemon and the native cosmos apis to query for transactions in order and index them.
The evm-targeted indexer (supporting ethereum and polygon for now) uses the [substreams](https://substreams.streamingfast.io/) firehose api and we intend to use substream for cosmos too.

#### Extra services: golang

We have additional services to serve custom aggregates that are not provided by the chain and some off-chain features (eg private user data).
We recommend [golang](https://go.dev/doc/) to write additional services, it's not a strict rule but golang is a good middle ground between performance and ease-of-use with a strong focus on maintainability.
The Cosmos SDK itself is written in golang.

#### Protocol for extra services: GRPC

We use [GRPC](https://grpc.io/) as communication protocol for the centralized APIs. The models and endpoints definition are written in [protobuf](https://protobuf.dev/), this allows to generate types, servers and clients in any language. The definition are in the [api folder](api). The backend servers in the [go/pkg folder](go/pkg). The clients in the [js/packages/api folder](js/packages/api).

The Cosmos SDK is also using protobuf for it's endpoints definition but with custom encodings and extra layers on top of it.

#### Future: Gno

We plan to transition from Cosmos SDK to [Gno](https://docs.gno.land/) for the blockchain nodes and smart-contracts framework

## Patterns

### CI

TODO: explain why the CI is here, how merge queue works, merge requirements, when to add new ci tasks

### Deployments

TODO: explain how backend and apps (web, mobile and desktop) are deployed

### Multi-chain

TODO: talk about networks, how to use them, network object ids, talk about the chain registry and how it's integrated into networks

### Network features

TODO: explain what is a network feature, when and how to add a new one

### IPFS

TODO: explain how to pin and retrieve files, ipfs:// uris vs cid, link to OptimizedImage, etc...

### Developer mode

TODO: explain how and why to use developer mode gating

### Handling currencies

TODO: talk about how an amount is defined, how it should be handled, displayed, etc...

### Cross-platform 

TODO: talk about the proper ways to make platform-specific code and common pitfalls coming from web-only

### Handling client-provided data

TODO: why and how all user-generated stuff must be validated

### Type-safety and linting

TODO: explain the importance of type-safety and linters, why ignore rules are bad and in what cases you can use them

### Implement an UI

TODO: explain how to properly take a figma and turn it into code

### Nested scroll

TODO: explain nested scrolling patterns

### GridList

TODO: explain how and when to use GridList

### Image proxy

TODO: explain what is the image proxy, why it's here and how to use it

### OptimizedImage

TODO: explain how and when to use OptimizedImage

### Handling users

TODO: explain userid, showcase components used to render username, avatar, etc..

### Handling nfts

TODO: explain nftid, collectionid, showcase components used to render collections and nfts, explain indexed vs on-chain data

### App modes

TODO: explain app modes
