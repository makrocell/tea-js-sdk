
import { 
  ApiPromise, 
  Keyring, 
  WsProvider,
} from '@polkadot/api';
import {
  cryptoWaitReady,
  mnemonicGenerate,
} from '@polkadot/util-crypto';
import {
  stringToU8a, 
  u8aToString, 
  u8aToHex, 
  stringToHex, 
  promisify,
  
} from '@polkadot/util';
import BN from 'bn.js';
import extension from './extension';

import {_} from '@tearust/utils';

const types: any = require('./res/types');
const rpc:any = require('./res/rpc');
const errors:any = require('./res/errors');

type Layer1Opts = {
  ws_url: string,
  http_url?: string,
  system_top_up_account?: string,
  faucet_value?: number,
};

export default class {

  opts: any;
  api: ApiPromise | null;
  extension: any;

  constructor(opts: Layer1Opts){
    if(!opts || !opts.ws_url){
      throw 'Invalid Layer1 options';
    }
    this.opts = _.extend({
      http_url: '',
      system_top_up_account: 'Ferdie',
      faucet_value: 1000,
    }, opts);

    this.api = null;
    this.extension = extension;
  }

  async init(){
    const wsProvider = new WsProvider(this.opts.ws_url);
    this.api = await ApiPromise.create({
      provider: wsProvider,
      types,
      rpc
    });

    await this.extension.init();
    await cryptoWaitReady();
  }

  getApi(): ApiPromise{
    const api = this.api;
    if(!api){
      throw 'Get Layer1 Api failed';
    }
    return api;
  }

  async getRealAccountBalance(account: string){
    const api = this.getApi();
    let { data: { free: previousFree }, nonce: previousNonce } = await api.query.system.account(account);

    const bn = parseInt(previousFree.toString(), 10);
    return bn;
  }

  async getAccountBalance(account: string){
    const real_balance = await this.getRealAccountBalance(account);

    const free = real_balance / this.asUnit().toNumber();
    return Math.floor(free*10000)/10000;
  }

  getAccountFrom(mn: string){
    if(mn.split(' ').length === 1){
      mn = '//'+mn;
    }

    const keyring = new Keyring({ type: 'sr25519' })
    const ac = keyring.addFromUri(mn);
    return ac;
  }

  mnemonicGenerate() {
    return mnemonicGenerate();
  }

  asUnit(num: number=1): BN{
    const yi = new BN('100000000', 10);
    const million = new BN('10000000', 10);
    const unit: BN = yi.mul(million);

    return unit.mul(new BN(num));
  }

  async faucet(target_address: string){
    const da = this.getAccountFrom(this.opts.system_top_up_account);
    const total = this.asUnit(this.opts.faucet_value);
    console.log('System account balance =>', await this.getRealAccountBalance(da.address));
    const api = this.getApi();
    const transfer_tx = api.tx.balances.transfer(target_address, total);

    await this.sendTx(da, transfer_tx);
  }

  async promisify(fn: Function) {
    return promisify(this, async (cb) => {
      try {
        await fn(cb);
      } catch (e) {
        cb(e.toString());
      }
    });
  }

  async buildAccount(account: any){
    if(_.isString(account)){
      return await this.extension.setSignerForAddress(account, this.getApi());
    }
    else{
      return account;
    }
  }

  async sendTx(account: any, tx: any){
    await this.buildAccount(account)
    return this.promisify(async (cb: Function)=>{
      await tx.signAndSend(account, (param: any)=>{
        this._transactionCallback(param, cb);
      });
    })
  }

  _transactionCallback(param: any, cb: Function) {
    const {events = [], status}: {events: any[], status: any} = param;
    if (status.isInBlock) {
      console.log('Included at block hash', status.asInBlock.toHex());
      console.log('Events:');

      const opts: any = {};
      events.forEach(({event: {data, method, section}, phase}) => {
        console.log(
          '\t',
          phase.toString(),
          `: ${section}.${method}`,
          data.toString(),
        );
        if (method === 'ExtrinsicFailed') {
          const error = this._findError(data);
          if (error) {
            cb(error);
            return;
          }
          opts.data = data;
        }
      });

      cb(null, opts);
    } else if (status.isFinalized) {
      console.log('Finalized block hash', status.asFinalized.toHex());
    }
  }

  _findError(data: any) {
    let err = false;
    let type_index = -1;
    _.each(data.toJSON(), (p) => {
      if (!_.isUndefined(_.get(p, 'Module.error'))) {
        err = _.get(p, 'Module.error');
        type_index = _.get(p, 'Module.index');
        return false;
      }
    });

    if (err !== false) {
      return _.get(errors, type_index+'.'+err, 'Not Found in Error definination with [index: '+type_index+', error: '+err+']');
    }

    return null;
  }


}