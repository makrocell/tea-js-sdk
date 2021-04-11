
import BasePallet from './BasePallet';
import helper from '../helper';

import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import {
  stringToU8a, 
  u8aToString, 
  hexToString,
  u8aToHex, 
  stringToHex, 
} from '@polkadot/util';

const {crypto} = require('tearust_utils');

export default class extends BasePallet {
  async sendNonceForPairMobileDevice(nonce: string, account: any){
    if(!nonce){
      throw 'Invalid nonce';
    }

    const nonce_hex = '0x'+crypto.hash(nonce);
    
    const api = this.layer1.getApi();
    const tx = api.tx.gluon.browserSendNonce(nonce_hex);

    await this.layer1.sendTx(account, tx);
  }

  async responePairWithNonce(
    nonce: string, 
    account: any, 
    pair_address: string, 
    meta_json: any,
  ){
    if(!nonce){
      throw 'Invalid nonce';
    }

    const api = this.layer1.getApi();
    const pub = decodeAddress(pair_address);
    const meta = JSON.stringify(meta_json);

    const e64 = crypto.encode64(meta);
    const hex = u8aToHex(pub);
    console.log('responePairWithNonce', nonce, hex, e64);
    const tx = api.tx.gluon.sendRegistrationApplication(nonce, hex, e64);
    
    await this.layer1.sendTx(account, tx);
  }

  async unpair(account: any){
    const api = this.layer1.getApi();
    const tx = api.tx.gluon.unpairAppBrowser();
    await this.layer1.sendTx(account, tx);
  }

  async _getAccountProfile(address: string){
    const api = this.layer1.getApi();
    const empty_hex = '0x0000000000000000000000000000000000000000000000000000000000000000';
    const pub = decodeAddress(address);
    let profile: any = {
      address,
    };
    
    let me: any = await api.query.gluon.browserAppPair(pub);
    if(u8aToHex(me[0]) === empty_hex){
      me = await api.query.gluon.appBrowserPair(pub);
    }

    if(u8aToHex(me[0]) === empty_hex){
      profile.meta = null;
      profile.pair_address = null;
    }
    else{
      profile.pair_address = encodeAddress(me[0]);
      profile.meta = crypto.decode64(u8aToString(me[1]));
      try{
        profile.meta = JSON.parse(profile.meta);
      }catch(e){
        throw 'Invalid meta data => '+profile.meta;
      }
    }

    return profile;
  }

  async getAccountProfile(address: string){
    const me = await this._getAccountProfile(address);
    if(!me.pair_address){
      return {
        ...me,
        pair_meta: null,
      };
    }

    const pair = await this._getAccountProfile(me.pair_address);
    me.pair_meta = pair.meta;

    return me;
  }

  async addTestAsset(account: any, test_address: string, key_type: string){
    const api = this.layer1.getApi();
    const tx = api.tx.gluon.testAddAccountAsset(stringToHex(key_type), stringToHex(key_type+'_'+test_address));

    await this.layer1.sendTx(account, tx);
  }

  async getAccountAssets(address: string){
    const api = this.layer1.getApi();
    const rs = await api.query.gluon.accountAssets(address);

    return rs.toHuman();
  }
  
}