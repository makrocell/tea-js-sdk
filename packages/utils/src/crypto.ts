
const js_sha256 = require('js-sha256');
const forge = require('node-forge');

const F = {
  hash(data: any){
    return js_sha256(data);
  },
  sha256(data: any){
    const tmp = forge.sha256.create();

    tmp.update(data);

    return tmp.digest().toHex();
  },

  encode64(data: any){
    return forge.util.encode64(data);
  },
  decode64(encode_data: string){
    return forge.util.decode64(encode_data);
  }
};

export default F;