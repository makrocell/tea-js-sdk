import {_, crpyto,moment, uuid} from '../';

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
  
    const hash_rs = crpyto.hash(data);
    const sha256_rs = crpyto.sha256(data);

    expect(hash_rs).toEqual(sha256_rs);
  });

  it('encode64 and decode64', () => {
    const rs = crpyto.encode64(data);

    expect(rs).toEqual('amFja3kubGk=');

    expect(data).toEqual(crpyto.decode64('amFja3kubGk='));
  });
});
