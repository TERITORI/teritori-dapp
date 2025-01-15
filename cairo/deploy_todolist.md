### Build contract
>>> scarb build
    Finished `dev` profile target(s) in 34 seconds

### Deploy account
Deploying a smart contract in Starknet requires two steps:
- Declaring the class of your contract, i.e. sending your contract’s code to the network.
- Deploying a contract, i.e. creating an instance of the code you previously declared.

#### Declare contract class
>>> starkli declare target/dev/todo_list_TodoList.contract_class.json

    Sierra compiler version not specified. Attempting to automatically decide version to use...
    Network detected: sepolia. Using the default compiler version for this network: 2.9.1. Use the --compiler-version flag to choose a different version.
    Declaring Cairo 1 class: 0x00e66510be5537b8dd645cbbd037d3d93e1668b35d6c030926da193d50e24017
    Compiling Sierra class to CASM with compiler version 2.9.1...
    CASM class hash: 0x03fe3154dad71870d2d0bad1ae60e489b4fa280c8c92549cfee5ceda27fa7853
    Contract declaration transaction: 0x05cd81e9b8f26bc36e287b6533af3c4d67dc5d15cea80c4c3a3e86e9907fee94
    Class hash declared:
    0x00e66510be5537b8dd645cbbd037d3d93e1668b35d6c030926da193d50e24017

#### Deploy declared contract
>>> starkli deploy 0x00e66510be5537b8dd645cbbd037d3d93e1668b35d6c030926da193d50e24017

    Deploying class 0x00e66510be5537b8dd645cbbd037d3d93e1668b35d6c030926da193d50e24017 with salt 0x01b63f25b7333d79f22c9decf878ec059110f0bcc24750af2be703a40c7f3b3e...
    The contract will be deployed at address 0x0203268c10434d563a4954bcd2af176095082545cd80d3c71bcd2a949ae6f46e
    Contract deployment transaction: 0x04f60e6f6eee888d558621d2f50e0fcefea2197216c688d4fda6df182090bf29
    Contract deployed:
    0x0203268c10434d563a4954bcd2af176095082545cd80d3c71bcd2a949ae6f46e


-------------------------------------
### Call function: get_balance 
>>> starkli call 0x0203268c10434d563a4954bcd2af176095082545cd80d3c71bcd2a949ae6f46e get_todos
    
    [
        "0x0000000000000000000000000000000000000000000000000000000000000000"
    ]

### Invoke function: add_todo
###### 131390907861965800123598923990466447259 = felt value of 'Teritori task'
>>> starkli invoke 0x0203268c10434d563a4954bcd2af176095082545cd80d3c71bcd2a949ae6f46e add_todo 131390907861965800123598923990466447259
    
    Invoke transaction: 0x030b446770b5b3e7a012cebda371426df6b31559fab99303ecd0d563b4320ade

### Invoke function: set_todo_done
>>> starkli invoke 0x0203268c10434d563a4954bcd2af176095082545cd80d3c71bcd2a949ae6f46e set_todo_done 0

    Invoke transaction: 0x01179e6a75e93b063570ad4c39fe306b90ca555839d2eef832a8117f59c22f8d
