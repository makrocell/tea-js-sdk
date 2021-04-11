const {web3Accounts, 
  web3Enable, 
  web3FromAddress,}: {
  web3Accounts: any, 
  web3Enable: any, 
  web3FromAddress: any,
} = require('@polkadot/extension-dapp');

const {_} = require('tearust_utils');

class Extension {
  constructor(){

  }
  async init(){
    await web3Enable('tea-dapp');
  }

  async getAllAccounts(){
    const allAccounts = await web3Accounts();

    return _.map(allAccounts, (item: any) => {
      return {
        address: item.address,
        name: item.meta.name,
        type: 'injected'
      };
    });
  }

  async setSignerForAddress(address: string, api: any){
    const injector = await web3FromAddress(address);

    api.setSigner(injector.signer);

    return injector;
  }
}

export default new Extension();