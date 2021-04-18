## TEA-JS-SDK
Base on Yarn workspace and Typescript.

### Packages Info

#### [tearust_utils](./packages/utils)
base utility for tearust, include lodash and moment.

#### [tearust_layer1](./packages/layer1)
JS SDK for tea layer1.

#### [cli](./packages/cli)
This is cli collection. Thanks for [POLKADOT-JS DEV](https://github.com/polkadot-js/dev/tree/master/packages/dev)


### Commands
```
// build
yarn build

// eslint
yarn lint

// unit test
yarn test

```


### Unit-test
- Run **yarn test** will collect all test-cases from every packages.
- tearust_layer1 unit-test require a local Layer1 node with ws://127.0.0.1:9944.
- Edit [jest.config.cjs](./jest.config.cjs) to add patterns to **modulePathIgnorePatterns** to skip when needed.




