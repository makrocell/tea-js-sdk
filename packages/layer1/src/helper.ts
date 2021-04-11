
const {_} = require('tearust_utils');

export default {
  getRandomNonce(): string {
    let nonce = _.random(1, 100000000000).toString();

    return nonce;
  }
}