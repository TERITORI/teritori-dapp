### Init project
>>> scarb new todo_list

### New account
>>> starkli account oz init account.json

### New keystore
>>> starkli signer keystore new keystore.json 

### Account address
0x05592f41259100b2e67112545aa55f1c93007ea2a7fab02132d75fa69f268b5d

### mnemonic
forum ensure laugh drastic shoulder knife finger fat antenna grow post wisdom

### Deploy account
>>> starkli account deploy account.json

    The estimated account deployment fee is 0.000113458052452609 ETH. However, to avoid failure, fund at least:
        0.000170187078678913 ETH
    to the following address:
        0x05592f41259100b2e67112545aa55f1c93007ea2a7fab02132d75fa69f268b5d
    Press [ENTER] once you've funded the address.
    Account deployment transaction: 0x04ea9b2e9692f33201ca5f8eda4387caa277b096ffd0181b2effd6bd760b8b34
    Waiting for transaction 0x04ea9b2e9692f33201ca5f8eda4387caa277b096ffd0181b2effd6bd760b8b34 to confirm. If this process is interrupted, you will need to run `starkli account fetch` to update the account file.
    Transaction not confirmed yet...
    Transaction 0x04ea9b2e9692f33201ca5f8eda4387caa277b096ffd0181b2effd6bd760b8b34 confirmed

### Build contract
>>> scarb build
    Finished `dev` profile target(s) in 34 seconds

### Deploy account
Deploying a smart contract in Starknet requires two steps:
- Declaring the class of your contract, i.e. sending your contract’s code to the network.
- Deploying a contract, i.e. creating an instance of the code you previously declared.

#### Declare contract class
>>> starkli declare target/dev/todo_list_HelloStarknet.contract_class.json

    Sierra compiler version not specified. Attempting to automatically decide version to use...
    Network detected: sepolia. Using the default compiler version for this network: 2.9.1. Use the --compiler-version flag to choose a different version.
    Declaring Cairo 1 class: 0x06cf2e0eeef89215d68a1aaca3bfbf8f899fd39472abfd8ad8911af9c507ff7b
    Compiling Sierra class to CASM with compiler version 2.9.1...
    CASM class hash: 0x00a3b109389575a420cd0c5ccbd14e9bf2f5b56d50f6085d08202d15ee2b3222
    Contract declaration transaction: 0x06d80076b0aac0eb64d745ac110188d917926d40c2d722d8e4ded07dc3d590d3
    Class hash declared:
    0x06cf2e0eeef89215d68a1aaca3bfbf8f899fd39472abfd8ad8911af9c507ff7b


#### Deploy declared contract
>>> starkli deploy 0x06cf2e0eeef89215d68a1aaca3bfbf8f899fd39472abfd8ad8911af9c507ff7b

    Enter keystore password: 
    Deploying class 0x06cf2e0eeef89215d68a1aaca3bfbf8f899fd39472abfd8ad8911af9c507ff7b with salt 0x03ec664467e3cfdb6917d5795dfabde3bc2d588fe58a78c6805f67c85ccf5167...
    The contract will be deployed at address 0x024068475e88548b0d6d06c6fbc5c691ce223ac611ca32a0a1b1c08a439d752a
    Contract deployment transaction: 0x02920ac2ce2cce14724b41d68e741712c90206ec6764530518b5c5f74e908e16
    Contract deployed:
    0x024068475e88548b0d6d06c6fbc5c691ce223ac611ca32a0a1b1c08a439d752a


-------------------------------------
### Call function: get_balance 
>>> starkli call 0x024068475e88548b0d6d06c6fbc5c691ce223ac611ca32a0a1b1c08a439d752a get_balance
    
    [
        "0x0000000000000000000000000000000000000000000000000000000000000000"
    ]

### Invoke function: increase_balance
>>> starkli invoke 0x024068475e88548b0d6d06c6fbc5c691ce223ac611ca32a0a1b1c08a439d752a increase_balance 1
    
    Invoke transaction: 0x04ac6c686e3517634b76e9efd70bca6787b723c878c6da7e9a878b4fe8a71a05

### Test state: recall get_balance
>>> starkli call 0x024068475e88548b0d6d06c6fbc5c691ce223ac611ca32a0a1b1c08a439d752a get_balance

    [
        "0x0000000000000000000000000000000000000000000000000000000000000001"
    ]
