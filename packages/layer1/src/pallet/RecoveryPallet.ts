import {hexToString,
  stringToHex, 
  stringToU8a, 
  u8aToHex, 
  u8aToString,} from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

import helper from '../helper';
import BasePallet from './BasePallet';

const {_, crypto} = require('tearust_utils');

export default class extends BasePallet {
  async getRecoveryInfo(lost_address: string){
    const api = this.layer1.getApi();
    const recoverable_rs = await api.query.recovery.recoverable(lost_address);

    return recoverable_rs.toHuman();
  }

  async getActiveRecoveriesInfo(lost_address: string, rescuer_address: string){
    const api = this.layer1.getApi();
    const activeRecoveries_rs = await api.query.recovery.activeRecoveries(lost_address, rescuer_address);

    return activeRecoveries_rs.toHuman();
  }

  async getProxy(rescuer_address: string){
    const api = this.layer1.getApi();
    const rs = await api.query.recovery.proxy(rescuer_address);

    return rs.toHuman();
  }

  async createRecovery(
    account: any, 
    friend_list: string[], 
    threshold: number, 
    delay_period: number,
  ){
    friend_list = _.sortBy(friend_list);
    const api = this.layer1.getApi();
    const tx = api.tx.recovery.createRecovery(friend_list, threshold, delay_period);

    await this.layer1.sendTx(account, tx);
  }

  async vouchRecovery(
    account: any, 
    lost_address: string, 
    rescuer_address: string,
  ){
    const api = this.layer1.getApi();
    const tx = api.tx.recovery.vouchRecovery(lost_address, rescuer_address);

    await this.layer1.sendTx(account, tx);
  }

  async initiateRecovery(
    account: any, 
    lost_address: string,
  ){
    const api = this.layer1.getApi();
    const tx = api.tx.recovery.initiateRecovery(lost_address);

    await this.layer1.sendTx(account, tx);
  }

  async claimRecovery(
    account: any, 
    lost_address: string,
  ){
    const api = this.layer1.getApi();
    const tx = api.tx.recovery.claimRecovery(lost_address);

    await this.layer1.sendTx(account, tx);
  }

  async transferAssetToRescuer(
    account: any, 
    lost_address: string,
  ){
    const me_address = _.isString(account) ? account : account.address;
    const api = this.layer1.getApi();
    const asset_tx = api.tx.gluon.testTransferAllAsset(me_address);
    const tx = api.tx.recovery.asRecovered(lost_address, asset_tx);

    await this.layer1.sendTx(account, tx);
  }

  async removeRecovery(
    account: any, 
    lost_address: string,
  ){
    const api = this.layer1.getApi();
    const remove_tx = api.tx.recovery.removeRecovery();
    const tx = api.tx.recovery.asRecovered(lost_address, remove_tx);

    await this.layer1.sendTx(account, tx);
  }

  async closeRecovery(
    account: any,
    lost_address: string,
  ){
    const me_address = _.isString(account) ? account : account.address;
    const api = this.layer1.getApi();
    const pre_tx = api.tx.recovery.closeRecovery(me_address);
    const tx = api.tx.recovery.asRecovered(lost_address, pre_tx);

    await this.layer1.sendTx(account, tx);
  }

}