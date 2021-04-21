import {_, crypto, moment, uuid} from '../';

describe('utils/index', () => {
  it('lodash verison', () => {
    expect(_.VERSION).toEqual('4.17.21');
  });

  it('moment verison', () => {
    expect(moment.version).toEqual('2.29.1');
  });


});

describe('utils/crypto', () => {
  const data = 'jacky.li';

  it('sha256 and hash', () => {
  
    const hash_rs = crypto.hash(data);
    const sha256_rs = crypto.sha256(data);

    expect(hash_rs).toEqual(sha256_rs);
  });

  it('encode64 and decode64', () => {
    const rs = crypto.encode64(data);

    expect(rs).toEqual('amFja3kubGk=');

    expect(data).toEqual(crypto.decode64('amFja3kubGk='));
  });
});
