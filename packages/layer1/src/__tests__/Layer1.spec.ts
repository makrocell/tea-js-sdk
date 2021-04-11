import {bnToBn, helper,Layer1} from '../';

const {sleep} = require('tearust_utils');

describe('layer1/Layer1', () => {
  

  it('it should correct when connect layer1', async ()=>{
    const o = new Layer1({
      ws_url: 'ws://127.0.0.1:9944',
    });

    await o.init();
    
    const test_mn = o.mnemonicGenerate();
    const test_ac = o.getAccountFrom(test_mn);

    const alice = o.getAccountFrom('Alice');
    const bob = o.getAccountFrom('Bob');

    // let balance = await o.getRealAccountBalance(test_ac.address);

    // await o.faucet(test_ac.address);
    // await sleep(1000);

    // balance = await o.getRealAccountBalance(test_ac.address);

    // const b1 = bnToBn(balance);
    // const b2 = bnToBn(o.asUnit(1000));
    // expect(b1.cmp(b2)).toEqual(0);

    const api = o.getApi();
    
    // gluon pallet - start
    // const gluonPallet = o.getGluonPallet();
    // let profile = await gluonPallet.getAccountProfile(alice.address);
    // console.log(11, profile);
    // const nonce = helper.getRandomNonce();
    // await gluonPallet.sendNonceForPairMobileDevice(nonce, alice);

    // await sleep(1000);

    // await gluonPallet.responePairWithNonce(nonce, bob, alice.address, {uuid: 'test_uuid'});
    // await sleep(1000);

    // profile = await gluonPallet.getAccountProfile(alice.address);
    // console.log(22, profile);

    // await gluonPallet.unpair(alice);
    // await sleep(1000);

    // profile = await gluonPallet.getAccountProfile(alice.address);
    // console.log(33, profile);
    // gluon pallet - end

  }, 30000);


});
