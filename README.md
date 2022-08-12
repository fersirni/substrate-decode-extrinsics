# substrate-decode-extrinsics
The main idea is to decode the extrinsics data from a block (using ink! contracts)

https://paritytech.github.io/ink/#how-it-works

## Steps to run 

### Running a local node
run the 'substrate-contracts-node' script by typing 
```sh
./substrate-contracts-node --dev
```
https://docs.substrate.io/tutorials/get-started/build-local-blockchain/

### Running the UI to deploy contracts
Clone this repo 'https://github.com/paritytech/contracts-ui', install dependencies using 
```sh
yarn
yarn start
```

### Deploy an ERC20 Contract
While using the UI use the src/erc20/erc20.contract to deploy. Other contracts at https://github.com/paritytech/ink/tree/master/examples
As this is a fresh new local node, generate some transactions. 

### Run the project
```sh
npm i
npm run build
npm run start
```