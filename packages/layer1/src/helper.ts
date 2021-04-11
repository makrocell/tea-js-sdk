
const {_} = require('tearust_utils');

import * as util_crypto from '@polkadot/util-crypto';

export default {
  ...util_crypto,
  getRandomNonce(): string {
    const nonce = _.random(1, 100000000000).toString();

    return nonce;
  },
};