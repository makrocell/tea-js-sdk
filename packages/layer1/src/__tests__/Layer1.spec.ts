import {Layer1} from '../';
import {sleep} from '@tearust/utils';

describe('layer1/Layer1', () => {
  

  it('it should correct when connect layer1', async ()=>{
    const o = new Layer1({
      ws_url: 'ws://127.0.0.1:9944',
    });
    await o.init();
    
    const test_mn = o.mnemonicGenerate();
    const test_ac = o.getAccountFrom(test_mn);

    let balance = await o.getRealAccountBalance(test_ac.address);

    await o.faucet(test_ac.address);
    await sleep(1000);

    balance = await o.getRealAccountBalance(test_ac.address);

    expect(balance.cmp(o.asUnit(1000))).toEqual(0);
  });


});
