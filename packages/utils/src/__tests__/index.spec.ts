import {_, moment, uuid} from '../';

describe('utils/index', () => {
  it('lodash verison should be correct', () => {
    expect(_.VERSION).toEqual('4.17.21');
  });

  it('moment verison should be correct', () => {
    expect(moment.version).toEqual('2.29.1');
  });


});
