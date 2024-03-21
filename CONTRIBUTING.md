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

### Transitioning from Web2 to Web3: A Developer's Guide 🌐➡️🔗

Welcome to the evolving landscape of web development. As we move from the centralized world of Web2 to the decentralized ecosystem of Web3, developers are presented with new paradigms, challenges, and opportunities. This guide aims to bridge the gap, highlighting the key differences between Web2 and Web3 and providing insights to ease the transition.

#### Understanding Web2 and Web3 🤔

##### Technical Infrastructure 🏗️

- **Web2:** Centralized servers and cloud providers like AWS, Google Cloud, and Azure dominate, offering scalable and reliable infrastructure but centralizing control.
- **Web3:** Utilizes decentralized networks, such as blockchain and peer-to-peer protocols, distributing data across numerous nodes to ensure security, privacy, and resistance to censorship.

##### Authentication 🔑

- **Web2:** Relies on centralized authentication services (e.g., OAuth, OpenID) where users log in using credentials managed by a third party.
- **Web3:** Employs asymmetric cryptography, allowing users to control their identities through cryptographic keys, enhancing security and privacy.

##### Data Storage and Management 📦

- **Web2:** Centralized databases and object storage services (e.g., Amazon S3) are prevalent, with data controlled by service providers.
- **Web3:** Decentralized storage solutions (e.g., IPFS, Filecoin) allow data to be distributed across the network, reducing reliance on central entities and improving data sovereignty.

#### Expanding the Comparison 📈

##### Data Ownership and Privacy 🔐

Web3 places a strong emphasis on user sovereignty and data privacy. Unlike Web2, where user data is often monetized by the platform, Web3 technologies empower users with control over their data, potentially revolutionizing privacy and security in the digital space.

##### Development and Maintenance 👨‍💻

Web3 emphasizes open-source development and collaborative maintenance, encouraging innovation and community engagement. This model contrasts with the proprietary technologies and platforms that dominate Web2.

##### Scalability and Performance ⚖️

While Web2 offers mature, scalable solutions, Web3 faces challenges related to its decentralized nature. However, ongoing developments in scaling solutions aim to address these issues.

##### User Experience 🧑‍🤝‍🧑

Web3 technologies often present a steeper learning curve for users. Developers are tasked with simplifying complex concepts to improve accessibility and drive adoption.

#### Navigating the Transition 🚀

##### Embrace the Learning Curve 📚

Familiarize yourself with blockchain basics, smart contracts, and the decentralized web. Resources are plentiful, ranging from online courses to community forums.

##### Experiment with Development Tools 🛠️

Explore Web3 development frameworks and tools (e.g., Truffle, Hardhat, Ethereum, Solana). Many offer robust environments for building decentralized applications (dApps).

##### Participate in Communities 👥

Join Web3 communities and forums. The open-source nature of Web3 development encourages collaboration and peer learning.

##### Focus on User Experience 💡

Consider the end-user experience in your projects. Simplifying interactions with Web3 technologies is crucial for broader adoption.

#### Conclusion 🎉

Transitioning from Web2 to Web3 is not merely a technological shift but a paradigmatic change in how we interact with the web. For developers, it represents an exciting opportunity to be at the forefront of building a more decentralized, transparent, and user-empowered internet. While challenges exist, the potential for innovation and impact is immense. Welcome to the future of web development.

### Frontend

TODO

### Backend

TODO

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
