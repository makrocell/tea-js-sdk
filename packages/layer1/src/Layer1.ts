import BN from 'bn.js';

import {ApiPromise, 
  Keyring, 
  WsProvider,} from '@polkadot/api';
import {BN_MILLION,
  bnToBn,
  promisify,
  stringToHex, 
  stringToU8a, 
  u8aToHex,
  numberToHex,
  bnFromHex,
  u8aToString
} from '@polkadot/util';
import {cryptoWaitReady,
  encodeAddress,
  mnemonicGenerate,
} from '@polkadot/util-crypto';


import GluonPallet from './pallet/GluonPallet';
import RecoveryPallet from './pallet/RecoveryPallet';

const types: any = require('./res/types');
const rpc: any = require('./res/rpc');

const {_} = require('tearust_utils');

let metadata = {};

type Layer1Opts = {
  ws_url: string,
  http_url?: string,
  system_top_up_account?: string,
  faucet_value?: number,
  onConnected?: () => void,
  onReady?: () => void,
  onDisconnected?: () => void,
  onConnectError?: (err: any) => void,
  env?: string,
  types?: any,
  rpc?: any,
};

export default class {

  opts: any;
  api: ApiPromise | null;
  extension: any;
  callback: any = {};

  private gluonPallet: GluonPallet | null;
  private recoveryPallet: RecoveryPallet | null;

  constructor(opts: Layer1Opts){
    if(!opts || !opts.ws_url){
      throw 'Invalid Layer1 options';
    }

    this.opts = _.extend({
      http_url: '',
      system_top_up_account: 'Ferdie',
      faucet_value: 1000,
      env: 'browser',
      types: types,
      rpc: rpc,
    }, opts);

    this.api = null;
    this.gluonPallet = null;
    this.recoveryPallet = null;

    this.extension = null;
  }

  destroy(){
    this.api = null;
    this.callback = {};
    this.gluonPallet = null;
    this.recoveryPallet = null;
    this.extension = null;
  }

  getMetadata(){
    return metadata;
  }

  initMetdata(api: any){
    const consts = api._consts;
    const events = api._events;
    const tx = api._extrinsics;
    const errors = api._errors;


    metadata = {
      consts,
      events,
      tx,
      errors,
      extrinsicVersion: api.extrinsicVersion,
      libraryInfo: api.libraryInfo,
      chainSS58: api.registry.chainSS58,
      token: api.registry.chainTokens[0],
      types: api.registry.knownTypes.types,
      runtimeChain: api._runtimeChain.toString(),
      supportMulti: api.supportMulti,

    };
  }

  buildCallback(key: string, cb: () => void) {
    this.callback[key] = cb;
  }

  handle_events(events: any) {
    _.each(events, (record: any) => {
      const {event, phase} = record;
      const types = event.typeDef;

      console.log(`[received layer1 event] section=${event.section}`);
      const eventData: any = {};

      event.data.forEach((data: any, index: number) => {
        console.log(`[layer1 event data] ${types[index].type}: ${data.toString()}`);
        eventData[types[index].type] = data;
      });

      const data = event.data;
      const key = event.section+'.'+event.method;
      const cb = _.get(this.callback, key, null);

      if(cb){
        cb(data, event);
      }
    });
    
  }

  async init(){
    const wsProvider = new WsProvider(this.opts.ws_url);

    wsProvider.on('connected', ()=>{
      console.log('***** Layer1 connected *****');
      this.opts.onConnected && this.opts.onConnected();
    });

    wsProvider.on('disconnected', ()=>{
      console.log('***** Layer1 disconneted *****');
      this.opts.onDisconnected && this.opts.onDisconnected();
    });

    wsProvider.on('error', (err)=>{
      this.opts.onConnectError && this.opts.onConnectError(err);
    });

    const _api = await ApiPromise.create({
      provider: wsProvider,
      types: this.opts.types,
      rpc: this.opts.rpc,
    });

    this.api = _api;

    this.initMetdata(this.api);

    console.log('***** Layer1 ready *****');
    this.opts.onReady && this.opts.onReady();

    if(this.opts.env === 'browser'){
      const Extension = require('./extension');
      this.extension = Extension.default ? new Extension.default() : new Extension();
      await this.extension.init();
    }
    

    this.api.query.system.events((events) => {
      this.handle_events(events);
    });

    await cryptoWaitReady();
  }

  async getLayer1Nonce(address: string){
    const api = this.getApi();
    const nonce = await api.rpc.system.accountNextIndex(address);

    return nonce;
  }

  getGluonPallet(): GluonPallet {
    if(!this.gluonPallet){
      this.gluonPallet = new GluonPallet(this);
    }

    return this.gluonPallet;
  }
  getRecoveryPallet(): RecoveryPallet {
    if(!this.recoveryPallet){
      this.recoveryPallet = new RecoveryPallet(this);
    }

    return this.recoveryPallet;
  }

  getApi(): ApiPromise{
    const api = this.api;

    if(!api){
      throw 'Get Layer1 Api failed';
    }

    return api;
  }

  async getRealAccountBalance(account: string): Promise<number> {
    const api = this.getApi();
    const { data: { free: previousFree }, nonce: previousNonce } = await api.query.system.account(account);

    const bn = parseInt(previousFree.toString(), 10);

    return bn;
  }

  async getAccountBalance(account: string): Promise<number>{
    const real_balance = await this.getRealAccountBalance(account);

    const free = real_balance / this.asUnit();

    return Math.floor(free*10000)/10000;
  }

  getAccountFrom(mn: string){
    if(mn.split(' ').length === 1){
      mn = '//'+mn;
    }

    const keyring = new Keyring({ type: 'sr25519' });
    const ac = keyring.addFromUri(mn);

    return ac;
  }

  mnemonicGenerate() {
    return mnemonicGenerate();
  }

  asUnit(num=1): number{
    const yi = new BN(BN_MILLION);
    const million = new BN(BN_MILLION);
    const unit: BN = yi.mul(million);

    return parseInt(unit.mul(new BN(num)).toString(10), 10);
  }

  async faucet(target_address: string){
    const da = this.getAccountFrom(this.opts.system_top_up_account);
    const total = this.asUnit(this.opts.faucet_value);

    console.log('System account balance =>', await this.getRealAccountBalance(da.address));
    const api = this.getApi();
    const transfer_tx = api.tx.balances.transfer(target_address, total);

    await this.sendTx(da, transfer_tx);
  }

  async promisify(fn: (arg: any) => void) {
    return promisify(this, async (cb) => {
      try {
        await fn(cb);
      } catch (e) {
        cb(e.toString());
      }
    });
  }

  async buildAccount(account: any){
    if(this.opts.env === 'browser' && _.isString(account)){
      return await this.extension.setSignerForAddress(account, this.getApi());
    }
    else{
      return account;
    }
  }

  async sendTx(account: any, tx: any, cb_true_data?: any) {
    await this.buildAccount(account);

    return this.promisify(async (cb: (arg1: any, arg2?: any) => void)=>{
      await tx.signAndSend(account, (param: any)=>{
        this._transactionCallback(param, (error: any) => {
          if(error){
            cb(error);
          }
          else{
            cb(null, cb_true_data);
          }
        });
        
      });
    });
  }

  _transactionCallback(param: any, cb: (arg1: any, arg2?: any) => void) {
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
    const api = this.getApi();

    _.each(data.toJSON(), (p: any) => {
      if (!_.isUndefined(_.get(p, 'module.error'))) {
        err = _.get(p, 'module.error');
        type_index = _.get(p, 'module.index');

        return false;
      }
    });

    if (err !== false) {
      const errorIndex = {
        index: bnFromHex(numberToHex(type_index)),
        error: bnFromHex(numberToHex(err)),
      };

      let error = null;
      try{
        error = api.registry.findMetaError(errorIndex);
        error = error.name;
      }catch(e){
        error = 'Not Found in Error definination with [index: '+type_index+', error: '+err+']';
      }
      
      return error;
    }

    return null;
  }

  async signWithExtension(account: any, data: any){
    if(!this.extension){
      throw 'Not Extension Environment.';
    }

    const api = this.getApi();

    await this.extension.setSignerForAddress(account, api);
    const sig = await api.sign(account, {
      data: stringToHex(data)
    });

    return sig;
  }

  async getCurrentBlock(){
    const api = this.getApi();

    const header = await api.rpc.chain.getHeader();

    return header.toHuman();
  }

  isConnected(){
    const api = this.getApi();

    return api.isConnected; 
  }

}