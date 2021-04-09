import * as _ from 'lodash';

describe('utils/index', ()=>{
  it('lodash verison should be correct', ()=>{
    expect(_.VERSION).toEqual('4.17.21');
  });
});